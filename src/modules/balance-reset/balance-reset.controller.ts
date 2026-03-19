import { Controller, Post } from '@nestjs/common';
import { BalanceResetService } from './balance-reset.service';

@Controller('balance-reset')
export class BalanceResetController {
  constructor(private readonly balanceResetService: BalanceResetService) {}

  @Post()
  async triggerBalanceReset() {
    const job = await this.balanceResetService.addResetJob();
    return {
      message: 'Задача на обнуление балансов поставлена в очередь',
      jobId: job.id,
    };
  }
}
