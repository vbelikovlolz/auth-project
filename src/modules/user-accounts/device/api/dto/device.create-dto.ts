import { BaseEntity } from 'typeorm';

export class DeviceCreateDto extends BaseEntity {
  userId: string;
  deviceId: string;
  issuedAt: Date;
  expirationAt: Date;
  deviceName: string;
  IP: string;
}
