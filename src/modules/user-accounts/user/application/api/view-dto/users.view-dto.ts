import { ApiProperty } from '@nestjs/swagger';

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

  static mapToView(dto: any): UserViewDto {
    const user = new UserViewDto();

    user.id = dto.id;
    user.login = dto.login;
    user.email = dto.email;
    user.createdAt = dto.createdAt;
    user.age = dto.age;
    user.description = dto.description;

    return user;
  }
}
