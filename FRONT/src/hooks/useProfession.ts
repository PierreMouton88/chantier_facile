import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { professionApi, type Profession } from "../api/profession.api";

const PROFESSIONS_QUERY_KEY = "professions";

export const useGetAllProfessions = (): UseQueryResult<Profession[], Error> => {
  return useQuery<Profession[], Error>({
    queryKey: [PROFESSIONS_QUERY_KEY],
    queryFn: () => professionApi.findAll(),
  });
};

export const useFindProfessionById = (
  id: number
): UseQueryResult<Profession | null, Error> => {
  return useQuery<Profession | null, Error>({
    queryKey: [PROFESSIONS_QUERY_KEY, id],
    queryFn: () => professionApi.findOne(id),
    enabled: !!id,
  });
};

export const useCreateProfession = (): UseMutationResult<
  Profession,
  Error,
  Omit<Profession, "id" | "created_at" | "updated_at">
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Profession,
    Error,
    Omit<Profession, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (body) => professionApi.create(body),
    onSuccess: (response) => {
      console.log("Profession créée :", response.profession_name);
      queryClient.invalidateQueries({ queryKey: [PROFESSIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};
export const useUpdateProfession = (): UseMutationResult<
  Profession,
  Error,
  { id: number; body: Partial<Profession> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Profession,
    Error,
    { id: number; body: Partial<Profession> }
  >({
    mutationFn: ({ id, body }) => professionApi.update(id, body),
    onSuccess: (response, variables) => {
      console.log("Profession updated :", response.profession_name);
      queryClient.invalidateQueries({ queryKey: [PROFESSIONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PROFESSIONS_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteProfession = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => professionApi.remove(id),
    onSuccess: () => {
      console.log("Profession effacée");
      queryClient.invalidateQueries({ queryKey: [PROFESSIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};
