import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { paginationType } from '../../../../../types/pagination-type';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { JwtAuthGuard } from '../../../guards/bearer/jwt-auth.guard';
import { paginationQueries } from '../../../../../core/helpers/pagination-queries';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserViewDto } from './view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

@Controller('users')
export class UsersController {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}

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
    @Query() queryParams: paginationType,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const paginationQueriesRes = paginationQueries(queryParams);
    return await this.usersQueryRepository.getUsers(paginationQueriesRes);
  }
}
