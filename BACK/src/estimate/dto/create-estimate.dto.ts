import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PaymentType } from '@prisma/client';

export class CreateEstimateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  estimate_number: number;

  @IsEnum(PaymentType)
  @IsOptional()
  payment_type?: PaymentType;

  @IsBoolean()
  @IsOptional()
  is_validated_by_customer?: boolean;

  @IsDateString()
  @IsNotEmpty()
  limit_date: Date;

  @IsInt()
  @IsNotEmpty()
  project_id: number;

  @IsInt()
  @IsNotEmpty()
  entreprise_id: number;
}
