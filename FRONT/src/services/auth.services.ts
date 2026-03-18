import { authApi } from '../api/auth.api'
import type { AuthResponse } from '../types/auth.type'

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
