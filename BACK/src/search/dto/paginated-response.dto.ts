import { Expose } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @Expose()
  data: T[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}
