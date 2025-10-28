import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return await this.users.findOne({
      where: { login },
    });
  }

  async save(user: User) {
    await this.users.save(user);
  }
}
