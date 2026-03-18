import type { Profession } from "../types/profession.type";
import { axiosClient } from "../utils/axios-client";

const api = axiosClient();
const ENDPOINT = "/profession";



export const professionApi = {
  // GET /profession
  findAll: () => api.get<Profession[]>(ENDPOINT).then(r => r.data),

  // GET /profession/:id
  findOne: (id: number) => api.get<Profession>(`${ENDPOINT}/${id}`).then(r => r.data),

  // POST /profession
  create: (data: Omit<Profession, "id" | "created_at" | "updated_at">) =>
    api.post<Profession>(ENDPOINT, data).then(r => r.data),

  // PUT /profession/:id
  update: (id: number, data: Partial<Profession>) =>
    api.put<Profession>(`${ENDPOINT}/${id}`, data).then(r => r.data),

  // DELETE /profession/:id
  remove: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`).then(r => r.data),
};
