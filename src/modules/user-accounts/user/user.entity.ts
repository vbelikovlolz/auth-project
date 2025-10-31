import { BaseEntity } from '../../../core/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
}
