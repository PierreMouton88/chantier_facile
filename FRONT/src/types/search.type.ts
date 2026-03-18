import type { User } from "./user.type";
import type { Address } from "./user.type";

export type CompanySearchResult = User & {
  role: "entreprise";
};

export type CustomerNameOnly = {
  name: string;
  first_name: string;
};

export type ProjectSearchResult = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  is_finished: boolean;
  address: Address;
  customer: CustomerNameOnly;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CompanySearchFilters = {
  city?: string;
  zip_code?: string;
  profession?: string;
  page?: number;
  limit?: number;
  sort?: 'name_asc' | 'name_desc';
};

export type ProjectSearchFilters = {
  city?: string;
  zip_code?: string;
  is_finished?: boolean;
  page?: number;
  limit?: number;
  sort?: 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc';
};
