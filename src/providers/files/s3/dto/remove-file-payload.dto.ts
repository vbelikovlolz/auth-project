import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFilePayloadDto {
  @ApiProperty({
    example: '/users/avatars/123',
  })
  @IsString()
  @IsNotEmpty()
  readonly path: string;
}
