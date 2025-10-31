import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAccountsConfig } from '../../../user/config/user-accounts.config';
import { AuthService } from '../../../auth/application/auth.service';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { DevicesQueryRepository } from '../../../device/infrastructure/devices.query.repository';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(
    private userAccountsConfig: UserAccountsConfig,
    private authService: AuthService,
    private devicesQueryRepository: DevicesQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;

          if (req && req.cookies) {
            token = req.cookies.refreshToken;
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.refreshTokenSecret,
    });
  }

  /**
   * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
   * @param payload
   */
  async validate(payload: any) {
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
