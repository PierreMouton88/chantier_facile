import { IsEmail, IsString } from 'class-validator';

// Données de connexion (email + mot de passe)
export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
