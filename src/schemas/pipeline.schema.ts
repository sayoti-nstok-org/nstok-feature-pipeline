import { z } from "zod";

export const DealStatusSchema = z.enum(["open", "won", "lost"]);
export type DealStatus = z.infer<typeof DealStatusSchema>;

export const StageDTOSchema = z.object({
  id: z.string(),
  pipelineId: z.string(),
  name: z.string().min(1, "Nama stage wajib diisi"),
  order: z.number().int().default(0),
  color: z.string().default("#3b82f6"),
  probability: z.number().int().min(0).max(100).default(50),
});
export type StageDTO = z.infer<typeof StageDTOSchema>;

export const PipelineDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  name: z.string().min(2, "Nama pipeline minimal 2 karakter"),
  description: z.string().optional(),
  isDefault: z.number().int().default(1),
  stages: z.array(StageDTOSchema).optional(),
});
export type PipelineDTO = z.infer<typeof PipelineDTOSchema>;

export const DealDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  pipelineId: z.string(),
  stageId: z.string(),
  customerId: z.string(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  title: z.string().min(2, "Judul deal minimal 2 karakter"),
  value: z.coerce.number().min(0).default(0),
  currency: z.string().default("IDR"),
  status: DealStatusSchema.default("open"),
  expectedCloseDate: z.string().optional(),
  ownerId: z.string().optional(),
  ownerName: z.string().optional(),
  lostReason: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type DealDTO = z.infer<typeof DealDTOSchema>;

export const CreateDealInputSchema = DealDTOSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  customerPhone: true,
  ownerName: true,
});
export type CreateDealInput = z.infer<typeof CreateDealInputSchema>;

export const UpdateDealInputSchema = CreateDealInputSchema.partial();
export type UpdateDealInput = z.infer<typeof UpdateDealInputSchema>;

export const MoveDealInputSchema = z.object({
  dealId: z.string(),
  targetStageId: z.string(),
  order: z.number().optional(),
});
export type MoveDealInput = z.infer<typeof MoveDealInputSchema>;
