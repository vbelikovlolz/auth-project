import { User } from '../../modules/user-accounts/user/user.entity';

export interface IUserRepository {
  findByLogin(login: string): Promise<User | null>;
  save(user: User);
  saveAll(user: User[]);
  getUserByLoginOrEmail(loginOrEmail: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllUsersBalance(): Promise<User[]>;
}
