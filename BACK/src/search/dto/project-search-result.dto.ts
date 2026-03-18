import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CustomerNameDto {
  @Expose()
  @Transform(({ obj }) => {
    if (obj.customer?.profile) {
      return obj.customer.profile.name;
    }
    return null;
  })
  name: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.customer?.profile) {
      return obj.customer.profile.first_name;
    }
    return null;
  })
  first_name: string;
}

@Exclude()
export class ProjectSearchResultDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  start_date: Date;

  @Expose()
  is_finished: boolean;

  @Expose()
  address: {
    id: number;
    address_line_1: string;
    zip_code: string;
    city: string;
    country: string;
  };

  @Expose()
  @Transform(({ obj }) => {
    if (obj.customer?.profile) {
      return {
        name: obj.customer.profile.name,
        first_name: obj.customer.profile.first_name,
      };
    }
    return null;
  })
  customer: CustomerNameDto;
}
