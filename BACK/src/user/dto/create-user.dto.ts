import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  is_validated: boolean;

  @IsEnum(Role)
  role?: Role;

  @IsString()
  @MinLength(8)
  password: string;
}
