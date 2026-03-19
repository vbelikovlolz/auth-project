import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferBalanceUserDto {
  @ApiProperty()
  @IsString()
  fromUserId: string;

  @ApiProperty()
  @IsString()
  toUserId: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'The amount must be a number with a maximum of 2 decimal places.',
    },
  )
  @IsPositive({ message: 'The transfer amount must be positive' })
  amount: number;
}
