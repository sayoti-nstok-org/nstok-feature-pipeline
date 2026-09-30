"use client";

import React, { useState } from "react";
import {
  usePipelines,
  useDeals,
  useMoveDeal,
  useCreateDeal,
} from "../hooks/use-pipeline";
import { usePipelineStore } from "../stores/pipeline.store";
import { DealDTO, StageDTO } from "../schemas/pipeline.schema";
import {
  Kanban,
  Plus,
  DollarSign,
  User,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function PipelineKanbanBoard() {
  const { currentPipeline, setCreateDealModalOpen } = usePipelineStore();
  const { data: deals = [], isLoading } = useDeals(currentPipeline.id);
  const moveDealMutation = useMoveDeal(currentPipeline.id);

  const stages = currentPipeline.stages || [];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    if (dealId) {
      moveDealMutation.mutate({ dealId, targetStageId: stageId });
    }
  };

  const totalPipelineValue = deals.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const wonDealsValue = deals
    .filter((d) => d.status === "won")
    .reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {currentPipeline.name}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {currentPipeline.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-background px-3 py-1.5 rounded-lg border border-border/80 text-xs shadow-xs">
            <span className="text-muted-foreground mr-2">Total Potensi:</span>
            <span className="font-bold text-primary">{formatRupiah(totalPipelineValue)}</span>
          </div>
          <div className="bg-background px-3 py-1.5 rounded-lg border border-border/80 text-xs shadow-xs">
            <span className="text-muted-foreground mr-2">Won Terakumulasi:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(wonDealsValue)}
            </span>
          </div>
          <button
            onClick={() => setCreateDealModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Deal Baru</span>
          </button>
        </div>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id);
          const stageTotal = stageDeals.reduce((acc, curr) => acc + (curr.value || 0), 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="flex flex-col bg-muted/40 rounded-xl border border-border/80 min-h-[420px] p-3 transition-colors hover:border-primary/40"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="text-xs font-bold text-foreground truncate">{stage.name}</h3>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-background border border-border/80 text-muted-foreground">
                  {stageDeals.length}
                </span>
              </div>

              {/* Stage Value Metric */}
              <div className="text-[11px] font-medium text-muted-foreground mb-3 px-1">
                {formatRupiah(stageTotal)}
              </div>

              {/* Deal Cards Container */}
              <div className="flex-1 space-y-2.5">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="group bg-card p-3 rounded-lg border border-border/80 shadow-xs hover:border-primary hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {deal.title}
                      </h4>
                      {deal.status === "won" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      )}
                      {deal.status === "lost" && (
                        <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>{formatRupiah(deal.value)}</span>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1 truncate">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{deal.customerName || "Pelanggan"}</span>
                      </div>
                      {deal.customerPhone && (
                        <a
                          href={`https://wa.me/${deal.customerPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline inline-flex items-center gap-0.5 shrink-0"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-[11px] text-muted-foreground/60">
                    Tarik deal ke sini
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateDealModal />
    </div>
  );
}

function CreateDealModal() {
  const { currentPipeline, isCreateDealModalOpen, setCreateDealModalOpen } = usePipelineStore();
  const createDealMutation = useCreateDeal(currentPipeline.id);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState(5000000);
  const [customerId, setCustomerId] = useState("cust-01");
  const [customerName, setCustomerName] = useState("Budi Santoso");
  const [stageId, setStageId] = useState("stage-lead");

  if (!isCreateDealModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDealMutation.mutate(
      {
        pipelineId: currentPipeline.id,
        stageId,
        customerId,
        customerName,
        title,
        value: Number(value),
        currency: "IDR",
        status: "open",
      },
      {
        onSuccess: () => {
          setCreateDealModalOpen(false);
          setTitle("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h3 className="text-base font-bold text-foreground">Tambah Deal Peluang Baru</h3>
          <button
            onClick={() => setCreateDealModalOpen(false)}
            className="text-muted-foreground hover:text-foreground text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-foreground block mb-1">Judul Deal / Peluang</label>
            <input
              type="text"
              required
              placeholder="Misal: Penjualan Grosir Minyak 20 Karton"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">Nilai Potensi (IDR)</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground block mb-1">Target Stage</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:outline-hidden focus:ring-1 focus:ring-primary"
              >
                {currentPipeline.stages?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Nama Klien / Pelanggan</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateDealModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border/80 font-medium text-muted-foreground hover:bg-muted/50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createDealMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {createDealMutation.isPending ? "Menyimpan..." : "Simpan Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
