import { User } from '../modules/user-accounts/user/user.entity';
import { AvatarInfo } from './avatar-info-type';

type SelectedUserFields = Pick<User, 'id' | 'email' | 'login' | 'createdAt'>;

export type UserWithAvatar = SelectedUserFields & {
  lastAvatar: AvatarInfo | null;
  activeAvatarsCount: number;
};
