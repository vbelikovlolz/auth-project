import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { UsersRepository } from '../user-accounts/user/infrastructure/users.repository';

@Processor('balance-reset-queue')
export class BalanceResetProcessor {
  private readonly logger = new Logger(BalanceResetProcessor.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  @Process('reset-balance') // Имя задачи, для которой предназначен этот метод
  async handleReset(job: Job) {
    this.logger.log(`Обработка задачи reset-balance с ID: ${job.id}`);

    try {
      const users = await this.usersRepository.findAllUsersBalance();
      this.logger.log(`Найдено ${users.length} пользователей для обновления`);

      /*const usersToUpdate = users.map((user) => {
        user.balance = 0;
        return user;
      });
      await this.usersRepository.saveAll(usersToUpdate);*/

      const userIds: string[] = users.map((user) => user.id);
      await this.usersRepository.resetBalances(userIds);

      this.logger.log(`Задача ${job.id} успешно выполнена. Балансы обнулены.`);

      return { success: true, processedCount: users.length };
    } catch (error) {
      this.logger.error(`Ошибка при выполнении задачи ${job.id}:`);
      throw error;
    }
  }
}
