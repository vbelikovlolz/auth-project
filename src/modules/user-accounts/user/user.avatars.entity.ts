import { BaseEntity } from '../../../core/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'USER_AVATARS' })
export class UserAvatarsEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  userId: string;

  @Column()
  @ApiProperty()
  isActive: boolean;
}
