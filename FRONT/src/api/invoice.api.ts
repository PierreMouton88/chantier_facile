import type { Invoice } from "../types/invoice.type";
import { axiosClient } from "../utils/axios-client";

const api = axiosClient();
const ENDPOINT = "/invoice";

export const invoiceApi = {
  // GET /invoice
  findAll: () => api.get<Invoice[]>(ENDPOINT).then(r => r.data),

  // GET /invoice/:id
  findOne: (id: number) => api.get<Invoice>(`${ENDPOINT}/${id}`).then(r => r.data),

  // POST /invoice
  create: (data: Omit<Invoice, "id" | "created_at" | "updated_at">) =>
    api.post<Invoice>(ENDPOINT, data).then(r => r.data),

  // PUT /invoice/:id
  update: (id: number, data: Partial<Invoice>) =>
    api.put<Invoice>(`${ENDPOINT}/${id}`, data).then(r => r.data),

  // DELETE /invoice/:id
  remove: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`).then(r => r.data),
};
