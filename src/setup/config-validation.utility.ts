import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '@nestjs/common';

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
