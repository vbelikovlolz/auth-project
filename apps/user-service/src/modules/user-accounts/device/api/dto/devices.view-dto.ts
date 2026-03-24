import { Device } from '../../domain/device.entity';
export class DevicesViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  static MapToView(dto: Device): DevicesViewDto {
    const device = new DevicesViewDto();
    device.ip = dto.IP;
    device.title = dto.deviceName;
    device.lastActiveDate = dto.issuedAt;
    device.deviceId = dto.deviceId;

    return device;
  }
}
