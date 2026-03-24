import { ApiProperty } from '@nestjs/swagger';
import { UserAvatarViewDto } from './users-avatar-view-dto';

export class UserViewDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  age: number;
  @ApiProperty()
  description: string;

  @ApiProperty({ type: [UserAvatarViewDto] })
  avatars: UserAvatarViewDto[];

  static mapToView(dto: any): UserViewDto {
    const user = new UserViewDto();

    user.id = dto.id;
    user.login = dto.login;
    user.email = dto.email;
    user.createdAt = dto.createdAt;
    user.age = dto.age;
    user.description = dto.description;

    user.avatars = dto.avatars;

    return user;
  }
}
