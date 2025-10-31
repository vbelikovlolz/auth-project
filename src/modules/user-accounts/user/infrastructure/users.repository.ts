import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { IUserRepository } from '../../../../core/infrastructure/user.repository.interface';
import { BaseRepository } from '../../../../core/infrastructure/base.repository';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends BaseRepository implements IUserRepository {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(dataSource);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }

  async findByLogin(login: string): Promise<User | null> {
    return await this.userRepository().findOne({
      where: { login },
    });
  }

  async save(user: User) {
    await this.userRepository().save(user);
  }
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    console.log('user');

    return await this.userRepository().findOne({
      where: [
        {
          login: loginOrEmail,
        },
        {
          email: loginOrEmail,
        },
      ],
    });
  }
}
