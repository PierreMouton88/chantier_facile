import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { CreateLineDto } from '../../line/dto/create-line.dto';
import { PaymentType } from '@prisma/client';

class LineInputDto extends OmitType(CreateLineDto, ['estimate_id'] as const) {}

export class CreateEstimateWithLinesDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineInputDto)
  lines: LineInputDto[];
}
