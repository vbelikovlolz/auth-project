import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';
export class UpdateDeviceCommand {
  constructor(
    public deviceId: string,
    public dto: { issuedAt: any; expirationAt: any },
  ) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(
    // @InjectModel(Device.name)
    // private DeviceModel: DeviceModelType,
    private devicesRepository: DevicesRepository,
  ) {}
  async execute({ deviceId, dto }: UpdateDeviceCommand): Promise<string> {
    const device = await this.devicesRepository.findOrNotFoundFail(deviceId);

    device.issuedAt = dto.issuedAt;
    device.expirationAt = dto.expirationAt;

    await this.devicesRepository.save(device);

    return device.id;
  }
}
