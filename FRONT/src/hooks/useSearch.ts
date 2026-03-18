import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";
import type {
  CompanySearchResult,
  ProjectSearchResult,
  PaginatedResponse,
  CompanySearchFilters,
  ProjectSearchFilters,
} from "../types/search.type";

const COMPANIES_SEARCH_QUERY_KEY = "companies-search";
const PROJECTS_SEARCH_QUERY_KEY = "projects-search";

export const useSearchCompanies = (
  filters: CompanySearchFilters
): UseQueryResult<PaginatedResponse<CompanySearchResult>, Error> => {
  return useQuery<PaginatedResponse<CompanySearchResult>, Error>({
    queryKey: [COMPANIES_SEARCH_QUERY_KEY, filters],
    queryFn: () => searchApi.searchCompanies(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetCompanyDetails = (
  id: number
): UseQueryResult<CompanySearchResult, Error> => {
  return useQuery<CompanySearchResult, Error>({
    queryKey: [COMPANIES_SEARCH_QUERY_KEY, id],
    queryFn: () => searchApi.getCompanyDetails(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchProjects = (
  filters: ProjectSearchFilters
): UseQueryResult<PaginatedResponse<ProjectSearchResult>, Error> => {
  return useQuery<PaginatedResponse<ProjectSearchResult>, Error>({
    queryKey: [PROJECTS_SEARCH_QUERY_KEY, filters],
    queryFn: () => searchApi.searchProjects(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetProjectDetails = (
  id: number
): UseQueryResult<ProjectSearchResult, Error> => {
  return useQuery<ProjectSearchResult, Error>({
    queryKey: [PROJECTS_SEARCH_QUERY_KEY, id],
    queryFn: () => searchApi.getProjectDetails(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetProjectTasks = (id: number) => {
  return useQuery({
    queryKey: [PROJECTS_SEARCH_QUERY_KEY, id, 'tasks'],
    queryFn: () => searchApi.getProjectTasks(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
