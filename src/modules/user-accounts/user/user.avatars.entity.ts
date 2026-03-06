import { BaseEntity } from '../../../core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'USER_AVATARS' })
export class UserAvatarsEntity extends BaseEntity {
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.avatars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @ApiProperty()
  url: string;

  @Column()
  @ApiProperty()
  name: string;
}
