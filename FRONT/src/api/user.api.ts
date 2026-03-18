import type
{
  Address,
  CustomerProfile,
  EntrepriseProfile,
  User,
} from "../types/user.type";
import axios from "axios";
import { axiosClient } from "../utils/axios-client";



const api = axiosClient();
const ENDPOINT = "/user";

export const userApi = {

  // GET /users
  getAllUsers: () => api.get<User[]>(`${ENDPOINT}`).then(r => r.data),

  //GET /users/entreprise
  getAllEntreprise: () => api.get<User[]>(`${ENDPOINT}/entreprise`).then(r => r.data),

  // GET /users/:id
  findOne: async (id?: number): Promise<User | null> => {
    try {
      const response = await api.get<User>(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // POST /users
  create: (data: Omit<CustomerProfile | EntrepriseProfile, "id" | "created_at" | "updated_at">) =>
    api.post<User>(`${ENDPOINT}`, data).then(r => r.data),

  // PUT /users/:id
  update: (id: number, data: Partial<CustomerProfile | EntrepriseProfile>) =>
    api.put<User>(`${ENDPOINT}/${id}`, data).then(r => r.data),

  // DELETE /users/:id
  delete: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`).then(r => r.data),

  // Gestion du profil
  // GET /users/:userId/profile
  getProfile: (userId: number) =>
    api.get<User>(`${ENDPOINT}/${userId}/profile`).then(r => r.data),

  // POST /users/:userId/profile
  createProfile: (userId: number, data: Omit<CustomerProfile | EntrepriseProfile, "id" | "created_at" | "updated_at">) =>
    api.post<CustomerProfile | EntrepriseProfile>(`${ENDPOINT}/${userId}/profile`, data).then(r => r.data),

  // PUT /profile/:profileId
  updateProfile: (profileId: number, data: Partial<CustomerProfile | EntrepriseProfile>) =>
    api.put<CustomerProfile | EntrepriseProfile>(`/profile/${profileId}`, data).then(r => r.data),

  // DELETE /users/:userId/profile
  removeProfile: (userId: number) =>
    api.delete<void>(`${ENDPOINT}/${userId}/profile`).then(r => r.data),

  // Gestion des professions du profil
  // POST /profile/:profileId/professions
  addProfessionsToProfile: (profileId: number, profession_ids: number[]) =>
    api.post(`/profile/${profileId}/professions`, { profession_ids }).then(r => r.data),

  // DELETE /profile/:profileId/professions/:professionId
  removeProfessionFromProfile: (profileId: number, professionId: number) =>
    api.delete(`/profile/${profileId}/professions/${professionId}`).then(r => r.data),

  // PUT /address/:id
  updateAddress: (addressId: number, data: Partial<Address>) =>
    api.put(`/address/${addressId}`, data).then(r => r.data),
};
