import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CreateUserCommand } from '../../user/application/usecases/create-user.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserBodyParams } from './input-dto/login-user-body-params';
import { ExtractUserAgentFromRequest } from '../../decorators/params/extract-user-agent.decorator';
import { LoginUserCommand } from '../../user/application/usecases/login-user.usecase';
import { AuthService } from '../application/auth.service';
import { CreateDeviceCommand } from '../../device/application/usecases/create-device.usecase';
import { DeviceCreateDto } from '../../device/api/dto/device.create-dto';
import { Response } from 'express';
import { DeviceContextDto } from '../../decorators/dto/device-context.dto';
import { ExtractDeviceFromCookie } from '../../decorators/params/extract-device.decorator';
import { UpdateDeviceCommand } from '../../device/application/usecases/update-device.usecase';
import { JwtRtAuthGuard } from '../../guards/bearer/refresh-token/jwt.rt-auth.guard';
import { JwtAuthGuard } from '../../guards/bearer/jwt-auth.guard';
import { UserContextDto } from '../../guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../../decorators/params/extract-user.decorator';
import { UsersQueryRepository } from '../../user/infrastructure/users.query.repository';
import { DeleteDeviceCommand } from '../../device/application/usecases/delete-device.usecase';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../user/user.entity';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(204)
  @ApiOperation({ summary: 'Registration in the system' })
  @ApiResponse({
    status: 200,
    description: 'Input data is accepted',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    type: DomainException,
  })
  async registration(@Body() body: CreateUserDto) {
    return await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(body),
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get information about current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: User,
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async me(@ExtractUserFromRequest() user: UserContextDto | null) {
    if (user?.id) {
      const userData = await this.usersQueryRepository.getByIdOrNotFoundFail(
        user.id,
      );

      return userData;
    }
  }

  @Post('logout')
  @ApiOperation({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtRtAuthGuard)
  @HttpCode(204)
  async logout(@ExtractDeviceFromCookie() device: DeviceContextDto | null) {
    if (device) {
      await this.commandBus.execute(new DeleteDeviceCommand(device.deviceId));
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    type: DomainException,
  })
  @ApiResponse({
    status: 401,
    description: 'If the password or login is wrong',
  })
  async login(
    @Body() body: LoginUserBodyParams,
    @Res({ passthrough: true }) res: Response,
    @ExtractUserAgentFromRequest() userAgent: string,
    @Ip() ip: string,
  ) {
    const user = await this.authService.checkCredentials(
      body.loginOrEmail,
      body.password,
    );

    const deviceIdRand = crypto.randomUUID();

    const deviceTokens = await this.commandBus.execute<
      LoginUserCommand,
      { accessToken: string; refreshToken: string }
    >(
      new LoginUserCommand({
        userId: user.id,
        deviceId: deviceIdRand,
      }),
    );
    const verifyRT = await this.authService.validateToken(
      deviceTokens.refreshToken,
    );
    const device = await this.commandBus.execute<
      CreateDeviceCommand,
      DeviceCreateDto
    >(
      new CreateDeviceCommand({
        userId: user.id,
        deviceId: deviceIdRand,
        issuedAt: new Date(Number(verifyRT.iat) * 1000),
        expirationAt: new Date(Number(verifyRT.exp) * 1000),
        deviceName: userAgent,
        IP: ip,
      }),
    );
    res.cookie('refreshToken', deviceTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return {
      accessToken: deviceTokens.accessToken,
    };
  }

  @Post('refresh-token')
  @UseGuards(JwtRtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate new pair of access and refresh tokens' })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async refreshToken(
    @ExtractDeviceFromCookie() device: DeviceContextDto | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (device?.userId && device.deviceId) {
      const deviceTokens = await this.commandBus.execute<
        LoginUserCommand,
        { accessToken: string; refreshToken: string }
      >(
        new LoginUserCommand({
          userId: device?.userId,
          deviceId: device?.deviceId,
        }),
      );

      // Куда положить верификацию токена
      const verifyRT = await this.authService.validateToken(
        deviceTokens.refreshToken,
      );

      await this.commandBus.execute<UpdateDeviceCommand, void>(
        new UpdateDeviceCommand(device?.deviceId, {
          issuedAt: new Date(verifyRT.iat * 1000),
          expirationAt: new Date(verifyRT.exp * 1000),
        }),
      );

      res.cookie('refreshToken', deviceTokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return {
        accessToken: deviceTokens.accessToken,
      };
    }
  }
}
