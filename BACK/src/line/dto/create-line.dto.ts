import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';

export class CreateLineDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price_per_qty: number;

  @IsInt()
  @IsNotEmpty()
  estimate_id: number;
}
