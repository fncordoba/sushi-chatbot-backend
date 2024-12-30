import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}