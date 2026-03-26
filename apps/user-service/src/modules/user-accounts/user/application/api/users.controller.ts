import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { JwtAuthGuard } from '../../../guards/bearer/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserViewDto } from './view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { UploadUserAvatarCommand } from '../usecases/upload-user-avatar.usecase';
import { DeleteUserAvatarCommand } from '../usecases/delete-user-avatar.usecase';
import { ExtractUserFromRequest } from '../../../decorators/params/extract-user.decorator';
import { UserContextDto } from '../../../guards/dto/user-context.dto';
import { IUploadedMulterFile } from '../../../../../providers/files/s3/interfaces/upload-file.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransferBalanceUserDto } from '../../dto/transfer-balance-user.dto';
import { TransferBalanceUserCommand } from '../usecases/transfer-balance-user.usecase';
import {
  paginationQueries,
  PaginationType,
} from '@app/shared/helpers/pagination-queries';
import { FileSizeValidationPipe } from '@app/shared/exceptions/file-size-validation-pipe';

@Controller('users')
export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Return all users' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: PaginatedViewDto,
  })
  async getUsers(
    @Query() queryParams: PaginationType,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const paginationQueriesRes: PaginationType = paginationQueries(queryParams);
    return await this.usersQueryRepository.getUsers(paginationQueriesRes);
  }

  @Post('/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload avatars by user' })
  async uploadPhoto(
    @ExtractUserFromRequest() user: UserContextDto | null,
    @UploadedFile(new FileSizeValidationPipe()) file: IUploadedMulterFile,
  ) {
    if (user?.id) {
      return await this.commandBus.execute<UploadUserAvatarCommand, boolean>(
        new UploadUserAvatarCommand({
          userId: user.id,
          file: file,
        }),
      );
    }
  }

  @Delete('/delete-photo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete avatars by user' })
  async deletePhoto(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('id', ParseUUIDPipe) avatarId: string,
  ) {
    return await this.commandBus.execute<DeleteUserAvatarCommand, string>(
      new DeleteUserAvatarCommand({
        userId: user.id,
        avatarId: avatarId,
      }),
    );
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top users' })
  async usersTop(@Query() queryParams: PaginationType) {
    const paginationQueriesRes: PaginationType = paginationQueries(queryParams);
    return await this.usersQueryRepository.usersTop(paginationQueriesRes);
  }
  @Post('transfer')
  @ApiOperation({ summary: 'Balance transfer between two users' })
  async transfer(@Body() transferBalanceUserDto: TransferBalanceUserDto) {
    return await this.commandBus.execute<TransferBalanceUserCommand, string>(
      new TransferBalanceUserCommand(transferBalanceUserDto),
    );
  }
}
