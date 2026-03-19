import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersAvatarsRepository } from '../../infrastructure/users.avatars.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { UserViewDto } from '../api/view-dto/users.view-dto';
import { Inject } from '@nestjs/common';
import { IFileService } from '../../../../../providers/files/files.adapter';

export class DeleteUserAvatarCommand {
  constructor(public dto: { userId: string; avatarId: string }) {}
}

@CommandHandler(DeleteUserAvatarCommand)
export class DeleteUserAvatarUseCase
  implements ICommandHandler<DeleteUserAvatarCommand, UserViewDto>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersAvatarsRepository: UsersAvatarsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    @Inject(IFileService)
    private readonly fileService: IFileService,
  ) {}

  async execute({ dto }: DeleteUserAvatarCommand): Promise<UserViewDto> {
    const { userId, avatarId } = dto;

    const userData = await this.usersRepository.findById(userId);
    if (!userData) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    const avatar = await this.usersAvatarsRepository.findByUserIdAvatar({
      userId: userId,
      avatarId: avatarId,
    });

    if (!avatar) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Avatar not found or you are not the owner',
      });
    }

    try {
      await this.fileService.removeFile({ path: avatar.url });
    } catch (error) {
      console.warn(`Failed to delete file from storage: ${avatar.url}`, error);
      // Можно продолжить удаление записи даже если файл не удалился
    }
    await this.usersAvatarsRepository.makeDeleted(avatarId);

    const userDataView =
      await this.usersQueryRepository.getByIdOrNotFoundFail(userId);

    return userDataView;
  }
}
