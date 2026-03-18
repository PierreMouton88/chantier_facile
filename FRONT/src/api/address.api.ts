import type { Address } from "../types/address.type";
import { axiosClient } from "../utils/axios-client";

const api = axiosClient();
const ENDPOINT = "/address";

export const addressApi = {
  // GET /address
  findAll: () => api.get<Address[]>(ENDPOINT).then(r => r.data),

  // GET /address/:id
  findOne: (id: number) => api.get<Address>(`${ENDPOINT}/${id}`).then(r => r.data),

  // POST /address
  create: (data: Omit<Address, "id" | "created_at" | "updated_at">) =>
    api.post<Address>(ENDPOINT, data).then(r => r.data),

  // PUT /address/:id
  update: (id: number, data: Partial<Address>) =>
    api.put<Address>(`${ENDPOINT}/${id}`, data).then(r => r.data),

  // DELETE /address/:id
  remove: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`).then(r => r.data),
};
