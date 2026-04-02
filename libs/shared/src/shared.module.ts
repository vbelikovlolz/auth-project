import { Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { AllHttpExceptionsFilter } from '@app/shared/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from '@app/shared/exceptions/filters/domain-exceptions.filter';
import { ObjectIdValidationTransformationPipe } from '@app/shared/exceptions/object-id-validation-transformation-pipe.service';
import { PaginationService } from '@app/shared/helpers/pagination-queries';
import { BaseRepository } from '@app/shared/infrastructure/base.repository';
import { AppSetupService } from '@app/shared/setup/app.setup.service';
import { PipesSetupService } from '@app/shared/setup/pipes.setup.service';

const providers = [
  SharedService,
  AllHttpExceptionsFilter,
  DomainHttpExceptionsFilter,
  ObjectIdValidationTransformationPipe,
  PaginationService,
  BaseRepository,
  AppSetupService,
  PipesSetupService,
];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class SharedModule {}
