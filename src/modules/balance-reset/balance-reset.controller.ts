import { Controller, Post } from '@nestjs/common';
import { BalanceResetService } from './balance-reset.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('balance-reset')
export class BalanceResetController {
  constructor(private readonly balanceResetService: BalanceResetService) {}

  @ApiOperation({ summary: 'Resetting the balance for all users' })
  @Post()
  async triggerBalanceReset() {
    const job = await this.balanceResetService.addResetJob();
    return {
      message: 'Задача на обнуление балансов поставлена в очередь',
      jobId: job.id,
    };
  }
}
