import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BalanceResetScheduler implements OnModuleInit {
  private readonly logger = new Logger(BalanceResetScheduler.name);

  constructor(
    @InjectQueue('balance-reset-queue')
    private readonly balanceResetQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.startScheduler();
    // this.startScheduler();
  }

  private async startScheduler() {
    this.logger.log(
      `Планировщик запущен через Bull. Обнуление балансов каждые 10 минут.`,
    );

    const INTERVAL_MS = 10 * 60 * 1000;

    await this.removeExistingRepeatableJobs();

    await this.balanceResetQueue.add(
      'reset-balance',
      {},
      {
        repeat: {
          every: INTERVAL_MS,
        },
        removeOnComplete: true,
        removeOnFail: false,
        jobId: 'scheduled-balance-reset',
      },
    );
  }

  private async removeExistingRepeatableJobs() {
    try {
      const repeatableJobs = await this.balanceResetQueue.getRepeatableJobs();

      for (const job of repeatableJobs) {
        if (job.name === 'reset-balance') {
          await this.balanceResetQueue.removeRepeatableByKey(job.key);
          this.logger.log(`Удалено существующее задание: ${job.key}`);
        }
      }
    } catch (error) {
      this.logger.error(`Ошибка при удалении заданий: ${error}`);
    }
  }
}
