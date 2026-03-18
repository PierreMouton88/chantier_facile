import { axiosClient } from "../utils/axios-client";
import type {
  CompanySearchResult,
  ProjectSearchResult,
  PaginatedResponse,
  CompanySearchFilters,
  ProjectSearchFilters,
} from "../types/search.type";

const api = axiosClient();
const ENDPOINT = "/search";

export const searchApi = {
  searchCompanies: (filters: CompanySearchFilters) => {
    const params = new URLSearchParams();

    if (filters.city) params.append('city', filters.city);
    if (filters.zip_code) params.append('zip_code', filters.zip_code);
    if (filters.profession) params.append('profession', filters.profession);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);

    return api
      .get<PaginatedResponse<CompanySearchResult>>(
        `${ENDPOINT}/companies?${params.toString()}`
      )
      .then((r) => r.data);
  },

  getCompanyDetails: (id: number) =>
    api
      .get<CompanySearchResult>(`${ENDPOINT}/companies/${id}`)
      .then((r) => r.data),

  searchProjects: (filters: ProjectSearchFilters) => {
    const params = new URLSearchParams();

    if (filters.city) params.append('city', filters.city);
    if (filters.zip_code) params.append('zip_code', filters.zip_code);
    if (filters.is_finished !== undefined) params.append('is_finished', filters.is_finished.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);

    return api
      .get<PaginatedResponse<ProjectSearchResult>>(
        `${ENDPOINT}/projects?${params.toString()}`
      )
      .then((r) => r.data);
  },

  getProjectDetails: (id: number) =>
    api
      .get<ProjectSearchResult>(`${ENDPOINT}/projects/${id}`)
      .then((r) => r.data),

  getProjectTasks: (id: number) =>
    api.get(`${ENDPOINT}/projects/${id}/tasks`).then((r) => r.data),
};
