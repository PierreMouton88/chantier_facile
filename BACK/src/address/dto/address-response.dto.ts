import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class AddressResponseDTO {
  @Expose()
  id: number;
  @Expose()
  address_line_1: string;

  @Expose()
  zip_code: string;

  @Expose()
  city: string;

  @Expose()
  country: string;
}
