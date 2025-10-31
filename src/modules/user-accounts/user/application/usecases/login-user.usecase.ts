import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constans/auth-tokens.inject-constants';

export class LoginUserCommand {
  constructor(public dto: { userId: string; deviceId: string }) {}
}
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,

    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}
  async execute({
    dto,
  }: LoginUserCommand): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.accessTokenContext.sign({ userId: dto.userId });

    const refreshToken = this.refreshTokenContext.sign({
      userId: dto.userId,
      deviceId: dto.deviceId,
    });
    return { accessToken, refreshToken };
  }
}
