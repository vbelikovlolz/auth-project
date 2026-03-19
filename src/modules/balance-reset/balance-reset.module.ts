import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BalanceResetController } from './balance-reset.controller';
import { BalanceResetService } from './balance-reset.service';
import { BalanceResetProcessor } from './balance-reset.processor';
import { BalanceResetScheduler } from './balance-reset.scheduler';
import { User } from '../user-accounts/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'balance-reset-queue', // Имя очереди
    }),
    UserAccountsModule,
  ],
  controllers: [BalanceResetController], // Контроллер для ручного запуска
  providers: [
    BalanceResetService, // Сервис для добавления задач в очередь
    BalanceResetProcessor, // Процессор, обрабатывающий задачи из очереди
    BalanceResetScheduler, // Планировщик для периодического запуска
  ],
})
export class BalanceResetModule {}
