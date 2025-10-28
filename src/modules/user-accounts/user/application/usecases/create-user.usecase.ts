import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BcryptService } from '../bcrypt.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../user.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUserCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute({ dto }: CreateUserCommand) {
    const { login, password, email, age, description } = dto;

    const userData = await this.usersRepository.findByLogin(login);

    if (userData) {
      throw new BadRequestException();
      // console.log(userData);
    }
    const passwordHash = await this.bcryptService.generationHash(password);
    const user = new User();
    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.age = age;
    user.description = description;

    await this.usersRepository.save(user);

    return user.id;
  }
}
