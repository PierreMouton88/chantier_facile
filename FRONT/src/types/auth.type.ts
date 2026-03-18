import type { User, Role } from "./user.type";

/**
 * Data required for user signup
 */
export type SignupData = {
  name: string;
  first_name?: string;
  phone_number?: string;
  email: string;
  password: string;
  address_line_1?: string;
  zip_code?: string;
  city?: string;
  country?: string;
};

/**
 * Data required for user signin
 */
export type SigninData = {
  email: string;
  password: string;
};

// Nouveau: payload d’inscription entreprise
export type EntrepriseSignupData = {
  email: string;
  password: string;
  first_name: string;
  name?: string;
  phone_number?: string;
  company_name?: string;
  siret?: string;
  address_line_1?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  professionNames?: string[];
};

// Nouveau: structure des tokens
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

// Réponse d’auth: tokens + user
export type AuthResponse = {
  tokens: Tokens;
  user: User;
};

export interface AuthCtxValue {
  isAuthenticated: boolean;
  role: Role | null;
  user: User | null;
  isAuthLoading: boolean;
  loginCtx: (res: AuthResponse) => void;
  logoutCtx: () => Promise<void>;
}
