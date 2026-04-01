import axios, { type AxiosInstance } from "axios";
import type { AuthResponse } from "../types/auth.type";

export function axiosClient(): AxiosInstance {
  const baseURL =
    import.meta.env.VITE_API_URL?.toString() ||
    (window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : `https://api.${window.location.hostname}`);

  const api: AxiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Intercepteur REQUEST — ajoute le token sans casser les types
  api.interceptors.request.use(
    (config) => {
      // Cookies httpOnly sont envoyés automatiquement, pas d'injection d'Authorization
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Intercepteur RESPONSE — refresh 401 et rejoue la requête
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config;
      const url: string =
        typeof originalRequest?.url === "string" ? originalRequest.url : "";
      const isAuthRequest =
        url.includes("/auth/signin") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/logout") ||
        url.includes("/auth/me");

      if (status === 401) {
        if (isAuthRequest) {
          return Promise.reject(error);
        }
        if ((originalRequest as any)._retry) {
          return Promise.reject(error);
        }
        (originalRequest as any)._retry = true;

        try {
          await axios.post<AuthResponse>(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          // Cookies mis à jour par le serveur; on rejoue la requête
          return api(originalRequest);
        } catch (refreshError) {
          const path = window.location.pathname;
          const publicPaths = [
            "/",
            "/home",
            "/login",
            "/signupEntreprise",
            "/signupUser",
          ];
          if (!publicPaths.includes(path)) {
            window.location.href = "/home";
          }
          return Promise.reject(refreshError);
        }
      }
      if (status === 403) {
        window.location.href = "/";
      }
      return Promise.reject(error);
    },
  );

  return api;
}
