import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserBodyParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
