import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  @Delete('all-data')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete all data' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async deleteAll() {
    await this.dataSource.query(`
          DELETE
          FROM public."DEVICE"
      `);
    await this.dataSource.query(`
      DELETE
      FROM public."USER"
    `);

    return;
  }
}
