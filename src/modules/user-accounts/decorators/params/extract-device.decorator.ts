import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractDeviceFromCookie = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): { userId: string; deviceId: string } => {
    const request = context.switchToHttp().getRequest();
    const device = request.user;

    if (!device) {
      throw new Error('there is no device in the request object!');
    }

    return device as { userId: string; deviceId: string };
  },
);
