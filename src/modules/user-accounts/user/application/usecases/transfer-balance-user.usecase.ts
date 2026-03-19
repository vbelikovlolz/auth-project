import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TransferBalanceUserDto } from '../../dto/transfer-balance-user.dto';

export class TransferBalanceUserCommand {
  constructor(public transferBalanceUserDto: TransferBalanceUserDto) {}
}
@CommandHandler(TransferBalanceUserCommand)
export class TransferBalanceUserUseCase
  implements ICommandHandler<TransferBalanceUserCommand>
{
  constructor(protected usersRepository: UsersRepository) {}

  @Transactional()
  async execute({
    transferBalanceUserDto,
  }: TransferBalanceUserCommand): Promise<{
    message: string;
    fromNewBalance: number;
    toNewBalance: number;
  }> {
    const { fromUserId, toUserId, amount } = transferBalanceUserDto;

    if (fromUserId === toUserId) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'You cannot transfer funds to yourself.',
      });
    }

    const fromUser =
      await this.usersRepository.findByIdPessimisticWrite(fromUserId);
    const toUser =
      await this.usersRepository.findByIdPessimisticWrite(toUserId);

    if (!fromUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }
    if (!toUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    if (fromUser.balance < amount) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Insufficient funds on the sender's balance. Available: ${fromUser.balance} USD`,
      });
    }

    fromUser.balance = Number((Number(fromUser.balance) - amount).toFixed(2));
    toUser.balance = Number((Number(toUser.balance) + amount).toFixed(2));

    await this.usersRepository.saveAll([fromUser, toUser]);

    return {
      message: 'Translation completed successfully',
      fromNewBalance: fromUser.balance,
      toNewBalance: toUser.balance,
    };
  }
}
