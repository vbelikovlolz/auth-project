import { BaseEntity } from '../../../../core/entities/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../../user/user.entity';

@Entity({ name: 'DEVICE' })
export class Device extends BaseEntity {
  @OneToOne(() => User)
  public user: User;

  @Column()
  userId: string;

  @Column()
  deviceId: string;

  @Column()
  issuedAt: Date;

  @Column()
  expirationAt: Date;

  @Column()
  deviceName: string;

  @Column()
  IP: string;
}
