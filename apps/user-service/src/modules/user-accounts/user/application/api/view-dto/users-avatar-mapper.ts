import { UserAvatarViewDto } from './users-avatar-view-dto';
import { UserAvatarsEntity } from '../../../user.avatars.entity';

export class UserAvatarMapper {
  static toViewDto(avatar: UserAvatarsEntity): UserAvatarViewDto {
    const dto = new UserAvatarViewDto();
    dto.id = avatar.id;
    dto.url = avatar.url;
    dto.name = avatar.name;
    dto.createdAt = avatar.createdAt;
    dto.updatedAt = avatar.updatedAt;
    return dto;
  }

  static mapToView(avatars: UserAvatarsEntity[]): UserAvatarViewDto[] {
    return avatars.map((avatar) => this.toViewDto(avatar));
  }
}
