import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '@nestjs/common';
import { Extension } from '@app/shared/exceptions/domain-exceptions';

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: Extension[],
): Extension[] => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error.constraints) {
      const constrainKeys = Object.keys(error.constraints);

      for (const key of constrainKeys) {
        errorsForResponse.push({
          message: error.constraints[key]
            ? `${error.constraints[key]}; Received value: ${error?.value}`
            : '',
          field: error.property,
        });
      }
    }
  }

  return errorsForResponse;
};

export const configValidationUtility = {
  validateConfig: <T extends object>(
    ConfigClass: new (partial?: Partial<T>) => T,
    config: Record<string, any>,
  ): T => {
    const instance = plainToInstance(ConfigClass, config, {
      enableImplicitConversion: true, // автоматически преобразует строки в числа/булевы значения
      excludeExtraneousValues: false, // не удалять лишние поля
    });

    const errors = validateSync(instance, {
      skipMissingProperties: false, // проверять обязательные поля
      forbidUnknownValues: true, // запрещать неизвестные значения
      whitelist: false, // не удалять поля без декораторов
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error: ValidationError) => {
          const constraints = error.constraints || {};
          return Object.values(constraints).join(', ');
        })
        .join('; ');

      throw new Error(
        `Config validation failed for ${ConfigClass.name}: ${messages}`,
      );
    }

    return instance;
  },
};
