import { BaseEntity } from '../../../core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class User extends BaseEntity {
  @Column()
  public login: string;

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  public age: number;

  @Column()
  public description: string;
}
