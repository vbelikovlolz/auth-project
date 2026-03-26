import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UserAvatarsEntity } from '../user.avatars.entity';
import { RedisService } from '../../../redis/redis.service';
import { AvatarInfo } from '../../../../types/avatar-info-type';
import { UserWithAvatar } from '../../../../types/user-avatar-type';
import { BaseRepository } from '@app/shared/infrastructure/base.repository';
import { UserViewDto } from '../application/api/view-dto/users.view-dto';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { PaginationType } from '@app/shared/helpers/pagination-queries';

@Injectable()
export class UsersQueryRepository extends BaseRepository {
  private readonly logger = new Logger(UsersQueryRepository.name);
  private readonly CACHE_TTL_SEC = 30;

  constructor(
    @InjectDataSource()
    dataSource: DataSource,
    private redisService: RedisService,
  ) {
    super(dataSource);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }

  private generateCacheKey(
    prefix: string,
    params: Record<string, unknown>,
  ): string {
    if (!params || typeof params !== 'object') {
      return prefix;
    }

    const sortedKeys = Object.keys(params).sort();
    const keyParts = sortedKeys
      .filter((key) => params[key] !== undefined)
      .map((key) => `${key}:${String(params[key])}`);

    return keyParts.length ? `${prefix}:${keyParts.join(':')}` : prefix;
  }

  private async getCachedData<T>(cacheKey: string): Promise<T | null> {
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
        return JSON.parse(cached) as T;
      }
    } catch (error) {
      this.logger.error(`Redis get error: ${(error as Error).message}`);
    }
    return null;
  }

  private async setCachedData(cacheKey: string, data: unknown): Promise<void> {
    try {
      await this.redisService.setex(
        cacheKey,
        this.CACHE_TTL_SEC,
        JSON.stringify(data),
      );
    } catch (error) {
      this.logger.error(`Redis set error: ${(error as Error).message}`);
    }
  }

  async getUsers(
    dto: PaginationType,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const {
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
      searchEmailTerm,
      searchLoginTerm,
    } = dto;

    const cacheKey = this.generateCacheKey('users:all', dto);
    const cached =
      await this.getCachedData<PaginatedViewDto<UserViewDto[]>>(cacheKey);
    if (cached) return cached;

    const query = this.userRepository().createQueryBuilder('u').select('u');

    if (searchEmailTerm || searchLoginTerm) {
      const conditions: string[] = [];
      const params: Record<string, string> = {};

      if (searchEmailTerm) {
        conditions.push('u.email LIKE :email');
        params.email = `%${searchEmailTerm}%`;
      }

      if (searchLoginTerm) {
        conditions.push('u.login LIKE :login');
        params.login = `%${searchLoginTerm}%`;
      }

      query.where(conditions.join(' OR '), params);
    }

    const sortDir = sortDirection.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    query.orderBy(`u.${sortBy}`, sortDir);

    const [users, total] = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const items = users.map((user) => UserViewDto.mapToView(user));

    const result = PaginatedViewDto.mapToView({
      page: pageNumber,
      size: pageSize,
      totalCount: Number(total),
      items,
    });

    await this.setCachedData(cacheKey, result);
    return result;
  }

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const cacheKey = this.generateCacheKey('user', { id });
    const cached = await this.getCachedData<UserViewDto>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository().findOne({
      where: { id },
      relations: ['avatars'],
    });

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    const result = UserViewDto.mapToView(user);
    await this.setCachedData(cacheKey, result);

    return result;
  }

  async usersTop(
    dto: PaginationType,
  ): Promise<PaginatedViewDto<UserWithAvatar[]>> {
    const { maxAge, minAge, pageNumber = 1, pageSize = 10 } = dto;

    const cacheKey = this.generateCacheKey('users:top', dto);
    const cached =
      await this.getCachedData<PaginatedViewDto<UserWithAvatar[]>>(cacheKey);
    if (cached) return cached;

    const queryBuilder = this.userRepository()
      .createQueryBuilder('user')
      .innerJoin('user.avatars', 'avatar', 'avatar.isActive = true')
      .where('user.description IS NOT NULL')
      .andWhere('user.description != :empty', { empty: '' })
      .groupBy('user.id')
      .having('COUNT(avatar.id) > 2');

    if (minAge) {
      queryBuilder.andWhere('user.age >= :minAge', { minAge });
    }
    if (maxAge) {
      queryBuilder.andWhere('user.age <= :maxAge', { maxAge });
    }

    const [userIds, total] = await queryBuilder
      .select('user.id', 'id')
      .orderBy('user.id', 'DESC')
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .getManyAndCount();

    const ids = userIds.map((u) => u.id);

    if (!ids.length) {
      const emptyResult = PaginatedViewDto.mapToView({
        page: pageNumber,
        size: pageSize,
        totalCount: Number(total),
        items: [],
      });
      await this.setCachedData(cacheKey, emptyResult);
      return emptyResult;
    }

    // Получаем пользователей и их аватары одним запросом
    const [users, lastAvatars] = await Promise.all([
      this.userRepository()
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.avatars', 'avatar', 'avatar.isActive = true')
        .where('user.id IN (:...ids)', { ids })
        .orderBy('user.id', 'DESC')
        .getMany(),

      this.getLastAvatars(ids),
    ]);

    const avatarMap = new Map<string, AvatarInfo>(
      lastAvatars.map((avatar) => [avatar.userId, avatar]),
    );

    const usersWithLastAvatar: UserWithAvatar[] = users.map((user) => ({
      ...user,
      lastAvatar: avatarMap.get(user.id) || null,
      activeAvatarsCount: user.avatars?.length || 0,
    }));

    const result = PaginatedViewDto.mapToView({
      page: pageNumber,
      size: pageSize,
      totalCount: Number(total),
      items: usersWithLastAvatar,
    });

    await this.setCachedData(cacheKey, result);
    return result;
  }

  private async getLastAvatars(userIds: string[]): Promise<AvatarInfo[]> {
    if (!userIds.length) return [];

    return this.userRepository()
      .createQueryBuilder()
      .select('DISTINCT ON (a.userId) a.*')
      .from(UserAvatarsEntity, 'a')
      .where('a.userId IN (:...ids)', { ids: userIds })
      .andWhere('a.isActive = true')
      .orderBy('a.userId')
      .addOrderBy('a.createdAt', 'DESC')
      .getRawMany<AvatarInfo>();
  }
}
