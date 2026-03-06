import { ApiProperty } from '@nestjs/swagger';

// Создаем отдельный DTO для аватара
export class UserAvatarViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static mapToView(avatar: any): UserAvatarViewDto {
    const dto = new UserAvatarViewDto();
    dto.id = avatar.id;
    dto.url = avatar.url;
    dto.name = avatar.name || avatar.originalName;
    dto.createdAt = avatar.createdAt;
    dto.updatedAt = avatar.updatedAt;
    return dto;
  }
}
