import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { paginationType } from '../../../../types/pagination-type';
import { UserViewDto } from '../application/api/view-dto/users.view-dto';
import { BaseRepository } from '../../../../core/infrastructure/base.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class UsersQueryRepository extends BaseRepository {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(dataSource);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }

  async getUsers(dto: paginationType) {
    const {
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
      searchEmailTerm,
      searchLoginTerm,
    } = dto;
    const query = this.userRepository()
      .createQueryBuilder()
      .select('u')
      .from(User, 'u');

    if (searchEmailTerm) {
      query.where('u.email LIKE :email', { email: `%${searchEmailTerm}%` });
    }

    if (searchLoginTerm) {
      if (searchEmailTerm) {
        query.andWhere('u.login LIKE :login', {
          login: `%${searchLoginTerm}%`,
        });
      } else {
        query.where('u.login LIKE :login', {
          login: `%${searchLoginTerm}%`,
        });
      }
    }

    if (sortBy && sortDirection) {
      let sortDir: 'ASC' | 'DESC' = 'DESC';
      if (sortDirection === 'asc') {
        sortDir = 'ASC';
      }
      query.orderBy(`u."${sortBy}"`, sortDir);
    }

    const res = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const items = res[0].map((user) => UserViewDto.mapToView(user));
    const totalCount = Number(res[1]);

    return PaginatedViewDto.mapToView({
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
      items: items,
    });
  }

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.userRepository().findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `user not found`,
      });
    }

    return UserViewDto.mapToView(user);
  }
}
