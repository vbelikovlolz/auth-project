import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractUserAgentFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const userAgent = request.headers['user-agent']
      ? request.headers['user-agent']
      : 'chrome';

    return userAgent;
  },
);
