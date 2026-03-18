import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfessionDto {
  @IsString()
  @IsNotEmpty()
  profession_name: string;
}
