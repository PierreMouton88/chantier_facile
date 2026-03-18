import axios from 'axios'
import { axiosClient } from '../utils/axios-client'
import type { SignupData, SigninData, AuthResponse, EntrepriseSignupData } from '../types/auth.type'


const api = axiosClient()
const baseURL = import.meta.env.VITE_API_URL?.toString()
  || (window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `https://api.${window.location.hostname}`)

export const authApi = {
  signup: (data: SignupData) =>
    api.post<AuthResponse>('/auth/signup', data).then(r => r.data),

  signin: (data: SigninData) =>
    api.post<AuthResponse>('/auth/signin', data).then(r => r.data),

  signupEntreprise: (data: EntrepriseSignupData) =>
    api.post<AuthResponse>('/auth/signup-entreprise', data).then(r => r.data),

  // Cookies httpOnly lus par le serveur; pas besoin de fournir le refreshToken
  refreshTokens: () =>
    axios.post<AuthResponse>(`${baseURL}/auth/refresh`, {}, { withCredentials: true }).then(r => r.data),

  // Retourne l'utilisateur courant (via cookies)
  me: () => api.get('/auth/me').then(r => r.data),

  // Déconnecte (supprime cookies côté serveur)
  logout: () => api.post<void>('/auth/logout', {}).then(r => r.data),

  
  adminProfile: () => api.get('/auth/admin-profile').then(r => r.data),
  adminDeleteUser: (userId: number) => api.post('/auth/admin-delete-user', { userId }).then(r => r.data),
}
