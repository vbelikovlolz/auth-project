import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../domain/device.entity';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { DevicesViewDto } from '../api/dto/devices.view-dto';

export class DevicesQueryRepository {
  constructor(
    /*@InjectModel(Device.name) private DeviceModel: DeviceModelType*/
    // @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Device)
    private devices: Repository<Device>,
  ) {}

  async findDevicesByUserId(userId: string) {
    const devices = await this.devices.find({
      where: { userId },
    });

    if (!devices) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'device is not found',
      });
    }

    const items = devices.map(DevicesViewDto.MapToView);

    return items;
  }
  async findById(deviceId: string): Promise<Device | null> {
    return await this.devices.findOne({
      where: { deviceId },
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

  async findByFilter(filter: any) {
    const res = await this.devices.findOne({
      where: {
        deviceId: filter.deviceId,
        userId: filter.userId,
        issuedAt: filter.issuedAt,
        expirationAt: filter.expirationAt,
      },
    });
    if (!res) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'device is not found',
      });
    }

    return res;
  }
}
