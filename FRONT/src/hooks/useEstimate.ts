import type { Estimate, CreateEstimateDto, UpdateEstimateDto } from "../types/estimate.type";
import type { Line } from "../types/line.type";
import { estimateApi } from "../api/estimate.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

const ESTIMATES_QUERY_KEY = "estimates";
const LINES_QUERY_KEY = "lines";

export const useGetAllEstimates = (): UseQueryResult<Estimate[], Error> => {
  return useQuery<Estimate[], Error>({
    queryKey: [ESTIMATES_QUERY_KEY],
    queryFn: () => estimateApi.findAll(),
  });
};

export const useFindEstimateById = (
  id: number
): UseQueryResult<Estimate | null, Error> => {
  return useQuery<Estimate | null, Error>({
    queryKey: [ESTIMATES_QUERY_KEY, id],
    queryFn: () => estimateApi.findOne(id),
    enabled: !!id,
  });
};

export const useCreateEstimate = (): UseMutationResult<
  Estimate,
  Error,
  CreateEstimateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<Estimate, Error, CreateEstimateDto>({
    mutationFn: (body: CreateEstimateDto) => estimateApi.create(body),
    onSuccess: (response) => {
      console.log("Devis créé :", response.title);
      queryClient.invalidateQueries({ queryKey: [ESTIMATES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};

export const useUpdateEstimate = (): UseMutationResult<
  Estimate,
  Error,
  { id: number; body: UpdateEstimateDto }
> => {
  const queryClient = useQueryClient();
  return useMutation<Estimate, Error, { id: number; body: UpdateEstimateDto }>(
    {
      mutationFn: ({ id, body }) => estimateApi.update(id, body),
      onSuccess: (response, variables) => {
        console.log("Devis mis à jour :", response.title);
        queryClient.invalidateQueries({ queryKey: [ESTIMATES_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [ESTIMATES_QUERY_KEY, variables.id],
        });
      },
      onError: (error) => {
        console.error("Erreur lors de la mise à jour :", error);
      },
    }
  );
};

export const useDeleteEstimate = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => estimateApi.remove(id),
    onSuccess: () => {
      console.log("Devis supprimé");
      queryClient.invalidateQueries({ queryKey: [ESTIMATES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};

// Gestion des lignes

export const useGetAllLinesByEstimateId = (
  estimateId: number
): UseQueryResult<Line[], Error> => {
  return useQuery<Line[], Error>({
    queryKey: [ESTIMATES_QUERY_KEY, estimateId, LINES_QUERY_KEY],
    queryFn: () => estimateApi.getAllLines(estimateId),
    enabled: !!estimateId,
  });
};

export const useFindLineById = (
  estimateId: number,
  lineId: number
): UseQueryResult<Line | null, Error> => {
  return useQuery<Line | null, Error>({
    queryKey: [ESTIMATES_QUERY_KEY, estimateId, LINES_QUERY_KEY, lineId],
    queryFn: () => estimateApi.getOneLine(estimateId, lineId),
    enabled: !!estimateId && !!lineId,
  });
};

export const useCreateLine = (): UseMutationResult<
  Line,
  Error,
  {
    estimateId: number;
    body: Omit<Line, "id" | "estimate_id" | "created_at" | "updated_at">;
  }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Line,
    Error,
    {
      estimateId: number;
      body: Omit<Line, "id" | "estimate_id" | "created_at" | "updated_at">;
    }
  >({
    mutationFn: ({ estimateId, body }) => estimateApi.addLine(estimateId, body),
    onSuccess: (response, variables) => {
      console.log("Ligne ajoutée :", response.description);
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId, LINES_QUERY_KEY],
      });
      // Invalider aussi le devis parent car le total peut changer
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la ligne :", error);
    },
  });
};

export const useUpdateLine = (): UseMutationResult<
  Line,
  Error,
  { estimateId: number; lineId: number; body: Partial<Line> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Line,
    Error,
    { estimateId: number; lineId: number; body: Partial<Line> }
  >({
    mutationFn: ({ estimateId, lineId, body }) =>
      estimateApi.updateLine(estimateId, lineId, body),
    onSuccess: (response, variables) => {
      console.log("Ligne mise à jour :", response.description);
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId, LINES_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ESTIMATES_QUERY_KEY,
          variables.estimateId,
          LINES_QUERY_KEY,
          variables.lineId,
        ],
      });
      // Invalider aussi le devis parent car ça le modifie
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la ligne :", error);
    },
  });
};

export const useDeleteLine = (): UseMutationResult<
  void,
  Error,
  { estimateId: number; lineId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { estimateId: number; lineId: number }>({
    mutationFn: ({ estimateId, lineId }) =>
      estimateApi.removeLine(estimateId, lineId),
    onSuccess: (_, variables) => {
      console.log("Ligne supprimée");
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId, LINES_QUERY_KEY],
      });
      // Invalider aussi le devis parent car ça le modifie
      queryClient.invalidateQueries({
        queryKey: [ESTIMATES_QUERY_KEY, variables.estimateId],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la ligne :", error);
    },
  });
};
