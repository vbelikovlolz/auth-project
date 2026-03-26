import { Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { AllHttpExceptionsFilter } from '@app/shared/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from '@app/shared/exceptions/filters/domain-exceptions.filter';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { ObjectIdValidationTransformationPipe } from '@app/shared/exceptions/object-id-validation-transformation-pipe.service';
import { paginationQueries } from '@app/shared/helpers/pagination-queries';

@Global()
@Module({
  providers: [
    AllHttpExceptionsFilter,
    DomainHttpExceptionsFilter,
    DomainException,
    ObjectIdValidationTransformationPipe,
    paginationQueries,
  ],
  exports: [SharedService],
})
export class SharedModule {}
