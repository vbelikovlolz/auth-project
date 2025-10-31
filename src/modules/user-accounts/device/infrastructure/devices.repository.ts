import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { Injectable } from '@nestjs/common';
import { Device } from '../domain/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device)
    private devices: Repository<Device>,
  ) {}

  async save(device: Device) {
    await this.devices.save(device);
  }

  async findById(deviceId: string): Promise<Device | null> {
    return await this.devices.findOne({
      where: {
        deviceId,
      },
    });
  }
  async findOrNotFoundFail(id: string): Promise<Device> {
    const device = await this.findById(id);

    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'device is not found',
      });
    }

    return device;
  }

  async deleteDevicesByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    await this.devices.delete({
      userId,
      deviceId: Not(In([deviceId])), // Используем Not вместе с оператором In
    });
    return true;
  }
  async deleteByDeviceId(deviceId: string): Promise<boolean | null> {
    await this.devices.softDelete({
      deviceId: deviceId,
    });
    return true;
  }
}
