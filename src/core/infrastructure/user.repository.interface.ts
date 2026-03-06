import { User } from '../../modules/user-accounts/user/user.entity';
import { UserAvatarsEntity } from '../../modules/user-accounts/user/user.avatars.entity';

export interface IUserRepository {
  findByLogin(login: string): Promise<User | null>;
  save(user: User);
  getUserByLoginOrEmail(loginOrEmail: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
