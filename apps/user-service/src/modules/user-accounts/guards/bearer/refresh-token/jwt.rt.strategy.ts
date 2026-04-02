import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { DevicesQueryRepository } from '../../../device/infrastructure/devices.query.repository';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../../../types/jwt.types';
import { Request } from 'express';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';
import { AppConfig } from '../../../../../config/app.config';

@Injectable()
class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  private readonly logger = new Logger(JwtRtStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private devicesQueryRepository: DevicesQueryRepository,
  ) {
    const appConfig = configService.get<AppConfig>('app')!;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;

          this.logger.log('RT JWT', req);

          if (req && req.cookies) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            token = req.cookies.refreshToken;
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfig.refreshTokenSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const device = await this.devicesQueryRepository.findByFilter({
      deviceId: payload.deviceId,
      userId: payload.userId,
      issuedAt: new Date(payload.iat * 1000),
      expirationAt: new Date(payload.exp * 1000),
    });

    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: `device not found in rt`,
      });
    }

    return {
      deviceId: payload.deviceId,
      userId: payload.userId,
    };
  }
}

export default JwtRtStrategy;
