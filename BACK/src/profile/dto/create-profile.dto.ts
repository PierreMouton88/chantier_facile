import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsBoolean()
  @IsOptional()
  is_newbie?: boolean;

  @IsString()
  @IsOptional()
  company_name?: string;

  @IsString()
  @IsOptional()
  siret?: string;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
