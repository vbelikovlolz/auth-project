import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { UserAccountsModule } from '../../../../user-service/src/modules/user-accounts/user-accounts.module';

@Module({
  imports: [UserAccountsModule],
  providers: [NotificationGateway],
})
export class NotificationModule {}
