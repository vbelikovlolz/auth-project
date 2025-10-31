//базовый класс view модели для запросов за списком с пагинацией
import { ApiProperty } from '@nestjs/swagger';
import { UserViewDto } from '../../modules/user-accounts/user/application/api/view-dto/users.view-dto';

export abstract class PaginatedViewDto<T> {
  @ApiProperty({ type: () => [UserViewDto], description: 'A list of items' })
  abstract items: T;
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  //статический метод-утилита для мапинга
  public static mapToView<T>(data: {
    items: T;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    return {
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      totalCount: data.totalCount,
      items: data.items,
    };
  }
}
