import { Module } from '@nestjs/common';
import { configModule } from './dynamic-config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { AppService } from './app.service';
import { TestingModule } from './modules/testing/testing.module';
import { FilesModule } from './providers/files/files.module';
import { RedisModule } from './modules/redis/redis.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { BalanceResetModule } from './modules/balance-reset/balance-reset.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllHttpExceptionsFilter } from '@app/shared/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from '@app/shared/exceptions/filters/domain-exceptions.filter';
import { appConfig, AppConfig } from './config/app.config';
import { SharedModule } from '@app/shared';
import { NotificationModule } from '../../notification-service/src/modules/notification/notification.module';
@Module({
  imports: [
    SharedModule,
    NotificationModule,
    ConfigModule.forFeature(appConfig),
    TestingModule,
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const appConfig = configService.get<AppConfig>('app')!;

        return {
          type: appConfig.postgresType,
          host: appConfig.postgresHost,
          port: appConfig.postgresPort,
          username: appConfig.postgresUsername,
          password: appConfig.postgresPass,
          database: appConfig.postgresDb,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],

      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return addTransactionalDataSource(dataSource);
      },
    }),
    BullModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const appConfig = configService.get<AppConfig>('app')!;
        return {
          redis: {
            host: appConfig.redisHost,
            port: appConfig.redisPort,
            password: appConfig.redisPass,
          },
          defaultJobOptions: {
            attempts: 3,
            removeOnComplete: false,
          },
        };
      },
      inject: [ConfigService],
    }),
    configModule,
    UserAccountsModule,
    FilesModule,
    RedisModule,
    BalanceResetModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
