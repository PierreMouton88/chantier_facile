import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsBoolean()
  is_newbie?: boolean;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  siret?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionNames?: string[];

  @IsOptional()
  @IsString()
  address_line_1?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
