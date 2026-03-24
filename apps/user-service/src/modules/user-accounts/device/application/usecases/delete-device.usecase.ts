import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';

export class DeleteDeviceCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase
  implements ICommandHandler<DeleteDeviceCommand, void>
{
  constructor(private devicesRepository: DevicesRepository) {}
  async execute({ deviceId }: DeleteDeviceCommand) {
    await this.devicesRepository.findOrNotFoundFail(deviceId);
    await this.devicesRepository.deleteByDeviceId(deviceId);
  }
}
