import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { IFileService } from '../../../../../providers/files/files.adapter';
import { Inject } from '@nestjs/common';
import { IUploadedMulterFile } from '../../../../../providers/files/s3/interfaces/upload-file.interface';
import { UserAvatarsEntity } from '../../user.avatars.entity';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { UserViewDto } from '../api/view-dto/users.view-dto';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';

export class UploadUserAvatarCommand {
  constructor(public dto: { userId: string; file: IUploadedMulterFile }) {}
}

@CommandHandler(UploadUserAvatarCommand)
export class UploadUserAvatarUseCase
  implements ICommandHandler<UploadUserAvatarCommand, UserViewDto>
{
  constructor(
    @Inject(IFileService)
    private readonly fileService: IFileService,
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute({ dto }: UploadUserAvatarCommand): Promise<UserViewDto> {
    const { userId, file } = dto;

    const result = await this.fileService.uploadFile({
      folder: `users/${userId}/${Date.now()}-${file.originalname}`,
      file: file,
      name: file.originalname,
    });

    const { path } = result;

    const userData = await this.usersRepository.findById(userId);

    if (!userData) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    if (userData.avatars.length >= 5) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Maximum 5 avatars allowed per user',
      });
    }

    const avatars = new UserAvatarsEntity();
    avatars.user = userData;
    avatars.url = path;
    avatars.name = file.originalname;

    if (!userData.avatars) {
      userData.avatars = [];
    }
    userData.avatars.push(avatars);
    await this.usersRepository.save(userData);

    return await this.usersQueryRepository.getByIdOrNotFoundFail(userData.id);
  }
}
