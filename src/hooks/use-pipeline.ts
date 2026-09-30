import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pipelineService } from "../services/pipeline.service";
import { CreateDealInput, UpdateDealInput, MoveDealInput } from "../schemas/pipeline.schema";

export const PIPELINES_QUERY_KEY = ["crm", "pipelines"];
export const DEALS_QUERY_KEY = ["crm", "deals"];

export function usePipelines() {
  return useQuery({
    queryKey: PIPELINES_QUERY_KEY,
    queryFn: () => pipelineService.getPipelines(),
  });
}

export function useDeals(pipelineId: string) {
  return useQuery({
    queryKey: [...DEALS_QUERY_KEY, pipelineId],
    queryFn: () => pipelineService.getDeals(pipelineId),
    enabled: !!pipelineId,
  });
}

export function useCreateDeal(pipelineId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDealInput) => pipelineService.createDeal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEALS_QUERY_KEY, pipelineId] });
    },
  });
}

export function useUpdateDeal(pipelineId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDealInput }) =>
      pipelineService.updateDeal(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEALS_QUERY_KEY, pipelineId] });
    },
  });
}

export function useMoveDeal(pipelineId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MoveDealInput) => pipelineService.moveDeal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEALS_QUERY_KEY, pipelineId] });
    },
  });
}

export function useDeleteDeal(pipelineId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pipelineService.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DEALS_QUERY_KEY, pipelineId] });
    },
  });
}
