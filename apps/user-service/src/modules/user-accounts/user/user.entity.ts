import { BaseEntity } from '../../../core/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserAvatarsEntity } from './user.avatars.entity';

@Entity({ name: 'USER' })
export class User extends BaseEntity {
  @Column()
  @ApiProperty()
  public login: string;

  @Column()
  @ApiProperty()
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  @ApiProperty()
  public age: number;

  @Column()
  @ApiProperty()
  public description: string;

  @ApiProperty()
  @OneToMany(() => UserAvatarsEntity, (userAvatars) => userAvatars.user, {
    cascade: true,
  })
  public avatars: UserAvatarsEntity[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @ApiProperty()
  public balance: number;
}
