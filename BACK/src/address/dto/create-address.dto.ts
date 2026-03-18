import { IsString, IsNotEmpty } from 'class-validator';
export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  address_line_1: string;
  @IsString()
  @IsNotEmpty()
  zip_code: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  country: string;
}
