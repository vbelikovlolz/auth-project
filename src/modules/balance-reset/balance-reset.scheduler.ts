import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BalanceResetService } from './balance-reset.service';

@Injectable()
export class BalanceResetScheduler implements OnModuleInit {
  private readonly logger = new Logger(BalanceResetScheduler.name);
  private intervalId: NodeJS.Timeout;

  constructor(private readonly balanceResetService: BalanceResetService) {}

  onModuleInit() {
    this.startScheduler();
  }

  private startScheduler() {
    const INTERVAL_MS = 10 * 60 * 1000; // 10 минут в миллисекундах

    this.logger.log(`Планировщик запущен. Обнуление балансов каждые 10 минут.`);

    this.intervalId = setInterval(() => {
      this.logger.log('Плановый запуск задачи на обнуление балансов...');

      this.balanceResetService
        .addResetJob()
        .then((job) => {
          this.logger.log(
            `Плановая задача добавлена в очередь с ID: ${job.id}`,
          );
        })
        .catch((error) => {
          this.logger.error(`Ошибка при добавлении плановой задачи: ${error}`);
        });
    }, INTERVAL_MS);

    // Чтобы планировщик не блокировал завершение приложения
    if (process.env.NODE_ENV === 'test') {
      clearInterval(this.intervalId);
    }
  }
}
