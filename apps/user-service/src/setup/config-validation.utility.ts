import { validateSync } from 'class-validator';

// просто утилита, даже не классом её сделали, чтобы не париться с DI и использовать её напрямую где надо нам.
export const configValidationUtility = {
  validateConfig: (config: any) => {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  },
};
