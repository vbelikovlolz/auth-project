// balance-reset.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BalanceResetService {
  private readonly logger = new Logger(BalanceResetService.name);

  constructor(
    @InjectQueue('balance-reset-queue') private balanceResetQueue: Queue,
  ) {}

  async addResetJob() {
    this.logger.log('Добавление задачи на обнуление балансов в очередь');

    const job = await this.balanceResetQueue.add(
      'reset-balance', // Имя задачи
      {
        timestamp: new Date().toISOString(),
        triggeredBy: 'api',
      },
      {
        attempts: 3,
        removeOnComplete: true,
      },
    );

    this.logger.log(`Задача добавлена с ID: ${job.id}`);
    return job;
  }
}
