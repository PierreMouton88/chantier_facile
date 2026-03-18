import type { Estimate, CreateEstimateDto, UpdateEstimateDto } from "../types/estimate.type";
import type { Line } from "../types/line.type";
import { axiosClient } from "../utils/axios-client";

const api = axiosClient();
const ENDPOINT = "/estimate";

export const estimateApi = {
  // GET /estimate
  findAll: () => api.get<Estimate[]>(ENDPOINT).then((r) => r.data),

  // GET /estimate/:id
  findOne: (id: number) =>
    api.get<Estimate>(`${ENDPOINT}/${id}`).then((r) => r.data),

  // POST /estimate
  create: (data: CreateEstimateDto) =>
    api.post<Estimate>(ENDPOINT, data).then((r) => r.data),

  // POST /estimate/with-lines
  createWithLines: (data: CreateEstimateDto) =>
    api.post<Estimate>(`${ENDPOINT}/with-lines`, data).then((r) => r.data),

  // PUT /estimate/:id
  update: (id: number, data: UpdateEstimateDto) =>
    api.put<Estimate>(`${ENDPOINT}/${id}`, data).then((r) => r.data),

  // DELETE /estimate/:id
  remove: (id: number) =>
    api.delete<void>(`${ENDPOINT}/${id}`).then((r) => r.data),

  // Gestion des lines du devis
  // GET /estimate/:id/lines
  getAllLines: (estimateId: number) =>
    api.get<Line[]>(`${ENDPOINT}/${estimateId}/lines`).then((r) => r.data),

  // GET /estimate/:id/lines/:lineId
  getOneLine: (estimateId: number, lineId: number) =>
    api.get<Line>(`${ENDPOINT}/${estimateId}/lines/${lineId}`).then((r) => r.data),

  // POST /estimate/:id/lines
  addLine: (
    estimateId: number,
    data: Omit<Line, "id" | "estimate_id" | "created_at" | "updated_at">
  ) =>
    api.post<Line>(`${ENDPOINT}/${estimateId}/lines`, data).then((r) => r.data),

  // PATCH /estimate/:id/lines/:lineId
  updateLine: (estimateId: number, lineId: number, data: Partial<Line>) =>
    api.patch<Line>(`${ENDPOINT}/${estimateId}/lines/${lineId}`, data).then((r) => r.data),

  // DELETE /estimate/:id/lines/:lineId
  removeLine: (estimateId: number, lineId: number) =>
    api.delete<void>(`${ENDPOINT}/${estimateId}/lines/${lineId}`).then((r) => r.data),
};
