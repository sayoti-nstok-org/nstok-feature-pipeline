import { create } from "zustand";
import { PipelineDTO, DealDTO, StageDTO } from "../schemas/pipeline.schema";
import { initialMockPipelines, initialMockStages } from "../services/pipeline.service";

interface PipelineState {
  currentPipeline: PipelineDTO;
  activeStageFilter: string | null;
  selectedDeal: DealDTO | null;
  isCreateDealModalOpen: boolean;
  setCurrentPipeline: (pipe: PipelineDTO) => void;
  setActiveStageFilter: (stageId: string | null) => void;
  setSelectedDeal: (deal: DealDTO | null) => void;
  setCreateDealModalOpen: (open: boolean) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  currentPipeline: initialMockPipelines[0],
  activeStageFilter: null,
  selectedDeal: null,
  isCreateDealModalOpen: false,
  setCurrentPipeline: (currentPipeline) => set({ currentPipeline }),
  setActiveStageFilter: (activeStageFilter) => set({ activeStageFilter }),
  setSelectedDeal: (selectedDeal) => set({ selectedDeal }),
  setCreateDealModalOpen: (isCreateDealModalOpen) => set({ isCreateDealModalOpen }),
}));
