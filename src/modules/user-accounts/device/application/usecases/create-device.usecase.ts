import { DevicesRepository } from '../../infrastructure/devices.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Device } from '../../domain/device.entity';
export class CreateDeviceCommand {
  constructor(
    public dto: {
      userId: string;
      deviceId: any;
      issuedAt: Date;
      expirationAt: Date;
      deviceName: string;
      IP: string;
    },
  ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase
  implements ICommandHandler<CreateDeviceCommand>
{
  constructor(
    // @InjectModel(Device.name)
    // private DeviceModel: DeviceModelType,
    @InjectDataSource() dataSource: DataSource,
    private devicesRepository: DevicesRepository,
  ) {}
  async execute({ dto }: CreateDeviceCommand) {
    const device = new Device();
    device.userId = dto.userId;
    device.deviceId = dto.deviceId;
    device.issuedAt = dto.issuedAt;
    device.expirationAt = dto.expirationAt;
    device.deviceName = dto.deviceName;
    device.IP = dto.IP;
    await this.devicesRepository.save(device);

    return device;
  }
}
