import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  user_id: number;

  @Expose()
  name: string;

  @Expose()
  first_name: string;

  @Expose()
  phone_number?: string;

  @Expose()
  is_newbie?: boolean;

  @Expose()
  company_name?: string;

  @Expose()
  siret?: string;
}
