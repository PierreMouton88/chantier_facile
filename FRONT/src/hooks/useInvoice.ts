import { type Invoice } from "./../types/invoice.type";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { invoiceApi } from "../api/invoice.api";

const INVOICES_QUERY_KEY = "invoices";

export const useGetAllInvoice = (): UseQueryResult<Invoice[], Error> => {
  return useQuery<Invoice[], Error>({
    queryKey: [INVOICES_QUERY_KEY],
    queryFn: () => invoiceApi.findAll(),
  });
};

export const useFindInvoiceById = (
  id: number
): UseQueryResult<Invoice | null, Error> => {
  return useQuery<Invoice | null, Error>({
    queryKey: [INVOICES_QUERY_KEY, id],
    queryFn: () => invoiceApi.findOne(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = (): UseMutationResult<
  Invoice,
  Error,
  Omit<Invoice, "id" | "created_at" | "updated_at">
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Invoice,
    Error,
    Omit<Invoice, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (body) => invoiceApi.create(body),
    onSuccess: (response) => {
      console.log("Facture créée :", response.title);
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};

export const useUpdateInvoice = (): UseMutationResult<
  Invoice,
  Error,
  { id: number; body: Partial<Invoice> }
> => {
  const queryClient = useQueryClient();
  return useMutation<Invoice, Error, { id: number; body: Partial<Invoice> }>({
    mutationFn: ({ id, body }) => invoiceApi.update(id, body),
    onSuccess: (response, variables) => {
      console.log("Facture mise à jour :", response.title);
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [INVOICES_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteInvoice = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => invoiceApi.remove(id),
    onSuccess: () => {
      console.log("Facture supprimée");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};

