import type { Address } from "../types/address.type";
import { addressApi } from "../api/address.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

const ADDRESSES_QUERY_KEY = "addresses";

export const useGetAllAddresses = (): UseQueryResult<Address[], Error> => {
  return useQuery<Address[], Error>({
    queryKey: [ADDRESSES_QUERY_KEY],
    queryFn: () => addressApi.findAll(),
  });
};

export const useFindAddressById = (
  id: number
): UseQueryResult<Address | null, Error> => {
  return useQuery<Address | null, Error>({
    queryKey: [ADDRESSES_QUERY_KEY, id],
    queryFn: () => addressApi.findOne(id),
    enabled: !!id,
  });
};

export const useCreateAddress = (): UseMutationResult<
  Address,
  Error,
  Omit<Address, "id" | "created_at" | "updated_at">
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Address,
    Error,
    Omit<Address, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (body) => addressApi.create(body),
    onSuccess: (response) => {
      console.log("Adresse créée :", response.address_line_1);
      queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};

export const useUpdateAddress = (): UseMutationResult<
  Address,
  Error,
  { id: number; body: Partial<Address> }
> => {
  const queryClient = useQueryClient();
  return useMutation<Address, Error, { id: number; body: Partial<Address> }>({
    mutationFn: ({ id, body }) => addressApi.update(id, body),
    onSuccess: (response, variables) => {
      console.log("Adresse mise à jour :", response.address_line_1);
      queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ADDRESSES_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteAddress = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => addressApi.remove(id),
    onSuccess: () => {
      console.log("Adresse supprimée");
      queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};
