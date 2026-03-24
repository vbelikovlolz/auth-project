import { Module } from '@nestjs/common';
import { configModule } from './dynamic-config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { AppService } from './app.service';
import { TestingModule } from './modules/testing/testing.module';
import { FilesModule } from './providers/files/files.module';
import { RedisModule } from './modules/redis/redis.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { BalanceResetModule } from './modules/balance-reset/balance-reset.module';
import { BullModule } from '@nestjs/bull';
import { RedisConfig } from './modules/redis/config/redis.config';
@Module({
  imports: [
    TestingModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
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
      useFactory(redisConfig: RedisConfig) {
        return {
          redis: {
            host: redisConfig.host || 'localhost',
            port: redisConfig.port || 6379,
            password: redisConfig.password,
          },
          defaultJobOptions: {
            attempts: 3,
            removeOnComplete: false,
          },
        };
      },
      inject: [RedisConfig],
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
