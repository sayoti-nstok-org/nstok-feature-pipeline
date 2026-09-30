import {
  PipelineDTO,
  DealDTO,
  StageDTO,
  CreateDealInput,
  UpdateDealInput,
  MoveDealInput,
} from "../schemas/pipeline.schema";

export interface PipelineRepositoryPort {
  getPipelines(): Promise<PipelineDTO[]>;
  getDeals(pipelineId: string): Promise<DealDTO[]>;
  createDeal(input: CreateDealInput): Promise<DealDTO>;
  updateDeal(id: string, input: UpdateDealInput): Promise<DealDTO>;
  moveDeal(input: MoveDealInput): Promise<DealDTO>;
  deleteDeal(id: string): Promise<void>;
}

const STORAGE_KEY_PIPELINES = "nstok_crm_pipelines_cache";
const STORAGE_KEY_DEALS = "nstok_crm_deals_cache";

export const initialMockStages: StageDTO[] = [
  { id: "stage-lead", pipelineId: "pipe-01", name: "Leads Baru", order: 0, color: "#3b82f6", probability: 20 },
  { id: "stage-contacted", pipelineId: "pipe-01", name: "Terkontak", order: 1, color: "#eab308", probability: 40 },
  { id: "stage-proposal", pipelineId: "pipe-01", name: "Kirim Proposal", order: 2, color: "#8b5cf6", probability: 70 },
  { id: "stage-won", pipelineId: "pipe-01", name: "Deals Won 🎉", order: 3, color: "#10b981", probability: 100 },
  { id: "stage-lost", pipelineId: "pipe-01", name: "Lost", order: 4, color: "#ef4444", probability: 0 },
];

export const initialMockPipelines: PipelineDTO[] = [
  {
    id: "pipe-01",
    organizationId: "org-01",
    name: "Pipeline B2B & Wholesale",
    description: "Alur negosiasi distributor dan mitra grosir",
    isDefault: 1,
    stages: initialMockStages,
  },
];

export const initialMockDeals: DealDTO[] = [
  {
    id: "deal-01",
    organizationId: "org-01",
    pipelineId: "pipe-01",
    stageId: "stage-lead",
    customerId: "cust-01",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    title: "Kontrak Pasokan Bahan Baku 100 Karung",
    value: 15500000,
    currency: "IDR",
    status: "open",
    ownerName: "Admin Sales",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "deal-02",
    organizationId: "org-01",
    pipelineId: "pipe-01",
    stageId: "stage-proposal",
    customerId: "cust-02",
    customerName: "Siti Rahma",
    customerPhone: "082345678901",
    title: "Pengadaan Restock Mingguan Outlet Melati",
    value: 8200000,
    currency: "IDR",
    status: "open",
    ownerName: "Admin Sales",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "deal-03",
    organizationId: "org-01",
    pipelineId: "pipe-01",
    stageId: "stage-won",
    customerId: "cust-03",
    customerName: "Ahmad Dahlan",
    customerPhone: "083456789012",
    title: "Penjualan Grosir Minyak Goreng 50 Karton",
    value: 12000000,
    currency: "IDR",
    status: "won",
    ownerName: "Admin Sales",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getStoredDeals(): DealDTO[] {
  if (typeof window === "undefined") return initialMockDeals;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(initialMockDeals));
      return initialMockDeals;
    }
    return JSON.parse(raw);
  } catch {
    return initialMockDeals;
  }
}

function saveStoredDeals(data: DealDTO[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const pipelineService: PipelineRepositoryPort = {
  async getPipelines(): Promise<PipelineDTO[]> {
    try {
      const res = await fetch("/api/crm/pipelines");
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return initialMockPipelines;
  },

  async getDeals(pipelineId: string): Promise<DealDTO[]> {
    try {
      const res = await fetch(`/api/crm/deals?pipelineId=${pipelineId}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const deals = getStoredDeals();
    return deals.filter((d) => d.pipelineId === pipelineId);
  },

  async createDeal(input: CreateDealInput): Promise<DealDTO> {
    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const deals = getStoredDeals();
    const newDeal: DealDTO = {
      ...input,
      id: `deal-${Date.now()}`,
      status: input.status || "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deals.unshift(newDeal);
    saveStoredDeals(deals);
    return newDeal;
  },

  async updateDeal(id: string, input: UpdateDealInput): Promise<DealDTO> {
    try {
      const res = await fetch(`/api/crm/deals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const deals = getStoredDeals();
    const idx = deals.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Deal tidak ditemukan");
    const updated = { ...deals[idx], ...input, updatedAt: new Date().toISOString() };
    deals[idx] = updated;
    saveStoredDeals(deals);
    return updated;
  },

  async moveDeal(input: MoveDealInput): Promise<DealDTO> {
    try {
      const res = await fetch(`/api/crm/deals/${input.dealId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const deals = getStoredDeals();
    const idx = deals.findIndex((d) => d.id === input.dealId);
    if (idx === -1) throw new Error("Deal tidak ditemukan");
    const targetStatus = input.targetStageId === "stage-won" ? "won" : input.targetStageId === "stage-lost" ? "lost" : "open";
    const updated: DealDTO = {
      ...deals[idx],
      stageId: input.targetStageId,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
    };
    deals[idx] = updated;
    saveStoredDeals(deals);
    return updated;
  },

  async deleteDeal(id: string): Promise<void> {
    try {
      await fetch(`/api/crm/deals/${id}`, { method: "DELETE" });
    } catch {
      // fallback
    }
    const deals = getStoredDeals().filter((d) => d.id !== id);
    saveStoredDeals(deals);
  },
};
