import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsInt()
  @IsNotEmpty()
  address_id: number;

  @IsInt()
  @IsNotEmpty()
  customer_id: number;

  @IsBoolean()
  @IsOptional()
  is_finished?: boolean;
}
