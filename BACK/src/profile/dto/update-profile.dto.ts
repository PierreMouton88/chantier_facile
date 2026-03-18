import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

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
}
