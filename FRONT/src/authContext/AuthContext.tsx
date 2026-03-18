import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse } from '../types/auth.type'
import { authService } from '../services/auth.services'
import type { AuthCtxValue } from '../types/auth.type'
import { useLogout, useMe } from '../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'

// Contexte
const AuthContext = createContext<AuthCtxValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const logoutMutation = useLogout()

  const { data: user, isSuccess , isLoading } = useMe()

  const isAuthLoading = isLoading;
  const isAuthenticated = !!user
  const role = user?.role ?? null;
  
  /* Hydratation initiale : démarre la refresh loop si user existe */
  useEffect(() => {
    if (isSuccess && user) {
      authService.startRefreshLoop()
    } else {
      authService.stopRefreshLoop()
    }
  }, [isSuccess, user])

  const loginCtx = (res: AuthResponse) => {
    queryClient.setQueryData(['user', 'me'], res.user)
    authService.startRefreshLoop()
  }

  const logoutCtx = async () => {
    await logoutMutation.mutateAsync()
    queryClient.setQueryData(['user', 'me'], null)
    authService.stopRefreshLoop()
  }


  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
            role, 
            user: user ?? null, 
            loginCtx, 
            logoutCtx, 
            isAuthLoading
      }}>
      {children}
    </AuthContext.Provider>
  )
}
// le contexte est un hook stockant isAuthenticated, role, user, loginCtx, logoutCtx
// Hook d'accès au contexte d'authentification 
export const useAuthCtx = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthCtx must be used within AuthProvider')
  return ctx
}
