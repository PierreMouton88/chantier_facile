import { authApi } from '../api/auth.api'
import type { AuthResponse, EntrepriseSignupData, SigninData, SignupData } from '../types/auth.type'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

/* ---------------------- Hooks ---------------------- */

export function useSignupCustomerV2(): UseMutationResult<AuthResponse, Error, SignupData> {
  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: () => authService.startRefreshLoop(),
  })
}

export function useSignupEntrepriseV2(): UseMutationResult<AuthResponse, Error, EntrepriseSignupData> {
  return useMutation<AuthResponse, Error, EntrepriseSignupData>({
    mutationFn: (data: EntrepriseSignupData) => authApi.signupEntreprise(data),
    onSuccess: () => authService.startRefreshLoop(),
  })
}

export function useSigninV2(): UseMutationResult<AuthResponse, Error, SigninData> {
  return useMutation<AuthResponse, Error, SigninData>({
    mutationFn: (data: SigninData) => authApi.signin(data),
    onSuccess: () => authService.startRefreshLoop(),
  })
}

export function useLogoutV2(): UseMutationResult<void, Error, void> {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await authApi.logout()
    },
  })
}

/* ---------------------- Service ---------------------- */

class AuthService {
  private refreshInterval?: number

// REFRESH TOKENS

  async refreshTokens(): Promise<AuthResponse> {
    return authApi.refreshTokens()
  }
  /* Lance la boucle de refresh côté client (10 min) */
  startRefreshLoop() {
    this.stopRefreshLoop()
    this.refreshInterval = window.setInterval(async () => {
      try {
        await this.refreshTokens()
        console.info('Access token rafraîchi')
      } catch {
        console.warn('Refresh échoué, déconnexion'),
        await authApi.logout()
      }
    }, 10 * 60 * 1000)
  }
  stopRefreshLoop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = undefined
    }
  }
}

export const authService = new AuthService()
