import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PaymentType, InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(PaymentType)
  @IsOptional()
  payment_type?: PaymentType;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsInt()
  @IsNotEmpty()
  estimate_id: number;
}
