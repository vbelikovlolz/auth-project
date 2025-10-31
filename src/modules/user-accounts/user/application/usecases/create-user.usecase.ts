import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BcryptService } from '../bcrypt.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../user.entity';
import { BadRequestException } from '@nestjs/common';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

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

    console.log(userData);

    if (userData) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same login already exists',
        extensions: [
          {
            field: 'email',
            message: 'invalid email',
          },
        ],
      });
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
