import { Module } from '@nestjs/common';
import { configModule } from './dynamic-config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { AppService } from './app.service';
import { TestingModule } from './modules/testing/testing.module';
@Module({
  imports: [
    TestingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5430,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    configModule,
    UserAccountsModule,
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
