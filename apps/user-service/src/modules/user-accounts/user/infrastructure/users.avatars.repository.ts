import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAvatarsEntity } from '../user.avatars.entity';
import { BaseRepository } from '@app/shared/infrastructure/base.repository';

@Injectable()
export class UsersAvatarsRepository extends BaseRepository {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(dataSource);
  }

  private userAvatarRepository(
    entityManager?: EntityManager,
  ): Repository<UserAvatarsEntity> {
    return this.getRepository(UserAvatarsEntity, entityManager);
  }

  async findById(id: string): Promise<UserAvatarsEntity | null> {
    return await this.userAvatarRepository().findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async findByUserIdAvatar({
    userId,
    avatarId,
  }): Promise<UserAvatarsEntity | null> {
    return await this.userAvatarRepository().findOne({
      where: { user: { id: userId }, id: avatarId },
      relations: ['user'],
    });
  }
  async makeDeleted(id: string) {
    return await this.userAvatarRepository().softDelete(id);
  }
}
