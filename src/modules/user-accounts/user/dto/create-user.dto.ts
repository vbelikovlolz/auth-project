import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  @ApiProperty({ default: 'PrBb1GIky7' })
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({ default: 'example@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  // @Length(1, 3)
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(0, 1000)
  description: string;
}
