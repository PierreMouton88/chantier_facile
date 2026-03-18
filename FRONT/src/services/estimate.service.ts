import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query"
import { estimateApi } from "../api/estimate.api"
import type { Estimate } from "../types/estimate.type"
import type { CreateEstimateDto, UpdateEstimateDto } from "../types/estimate.type"


class EstimateService {
  public getAll(): UseQueryResult<Estimate[], Error> {
    return useQuery<Estimate[], Error>({
      queryKey: ["estimates"],
      queryFn: () => estimateApi.findAll(),
    })
  }

  public findOne(id: string): UseQueryResult<Estimate | null, Error> {
    return useQuery<Estimate | null, Error>({
      queryKey: ["estimates", id],
      queryFn: () => estimateApi.findOne(+id),
    })
  }

  public create(): UseMutationResult<Estimate, Error, CreateEstimateDto> {
    const queryClient = useQueryClient()
    return useMutation<Estimate, Error, CreateEstimateDto>({
      mutationFn: (data) => estimateApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["estimates"] })
      },
    })
  }

  public createWithLines(): UseMutationResult<Estimate, Error, CreateEstimateDto> {
    const queryClient = useQueryClient()
    return useMutation<Estimate, Error, CreateEstimateDto>({
      mutationFn: (data) => estimateApi.createWithLines(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["estimates"] })
      },
    })
  }

  public update(): UseMutationResult<Estimate, Error, { id: number; data: UpdateEstimateDto }> {
    const queryClient = useQueryClient()
    return useMutation<Estimate, Error, { id: number; data: UpdateEstimateDto }>({
      mutationFn: ({ id, data }) => estimateApi.update(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["estimates"] })
        queryClient.invalidateQueries({ queryKey: ["estimates", String(variables.id)] })
      },
    })
  }

  public remove(): UseMutationResult<void, Error, number> {
    const queryClient = useQueryClient()
    return useMutation<void, Error, number>({
      mutationFn: (id) => estimateApi.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["estimates"] })
      },
    })
  }
}

export const estimateService = new EstimateService()
