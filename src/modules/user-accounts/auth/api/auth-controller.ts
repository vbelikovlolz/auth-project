import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CreateUserCommand } from '../../user/application/usecases/create-user.usecase';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() body: CreateUserDto) {
    return await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(body),
    );
  }

  @Get('me')
  async me() {}

  @Get('get-all')
  async getAll() {}

  @Post('logout')
  async logout() {}

  @Post('login')
  async login() {}
}
