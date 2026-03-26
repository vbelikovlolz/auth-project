import { INestApplication, ValidationPipe } from '@nestjs/common';

import { errorFormatter } from '@app/shared/config/config-validation.utility';
import { ObjectIdValidationTransformationPipe } from '@app/shared/exceptions/object-id-validation-transformation-pipe.service';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new ObjectIdValidationTransformationPipe(),
    new ValidationPipe({
      //class-transformer создает экземпляр input-dto
      //соответственно применятся значения по-умолчанию
      //и методы классов input-dto
      transform: true,
      // whitelist: true,
      //Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      //Для преобразования ошибок класс валидатора в необходимый вид
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
