import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { DeviceContextDto } from '../dto/device-context.dto';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): DeviceContextDto => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const logger = new Logger('ExtractUserFromRequest');

    logger.log('RT JWT', request);

    if (!user) {
      throw new Error('there is no user in the request object!');
    }

    return user;
  },
);
