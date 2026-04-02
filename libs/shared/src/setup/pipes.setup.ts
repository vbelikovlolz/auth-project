import { INestApplication, ValidationPipe } from '@nestjs/common';

import { errorFormatter } from '@app/shared/config/config-validation.utility';
import { ObjectIdValidationTransformationPipe } from '@app/shared/exceptions/object-id-validation-transformation-pipe.service';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';

export function pipesSetupService(app: INestApplication) {
  app.useGlobalPipes(
    new ObjectIdValidationTransformationPipe(),
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);
        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: formattedErrors,
        });
      },
    }),
  );
}
