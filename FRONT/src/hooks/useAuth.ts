import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { authService } from '../services/auth.services'
import type { SigninData, AuthResponse, SignupData, EntrepriseSignupData } from '../types/auth.type'
import type { User } from '../types/user.type'


export const useMe = () => {
  return useQuery<User | null, Error>({
    queryKey: ['user', 'me'],
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000,
    retry: false, // Pas de retry si 401 (l'utilisateur n'est pas connecté)
    refetchOnWindowFocus: false, // Pas de refetch au focus de la fenêtre
    refetchOnReconnect: false, // Pas de refetch à la reconnexion
  })
}
  export const useSignupCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: (response) =>  {
      queryClient.setQueryData(['user', 'me'], response.user)
      authService.startRefreshLoop()
    },
    onError: () => {
      authService.stopRefreshLoop()
    }
  })
}

export const useSignupEntreprise = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, EntrepriseSignupData>({
    mutationFn: (data: EntrepriseSignupData) => authApi.signupEntreprise(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'me'], response.user)
      authService.startRefreshLoop()
    },
    onError: () => {
      authService.stopRefreshLoop()
    }
  })
}

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, SigninData>({
    mutationFn: (data: SigninData) => authApi.signin(data),
    onSuccess: (response) => {
      // Met à jour le cache avec le user reçu
      queryClient.setQueryData(['user', 'me'], response.user)
      authService.startRefreshLoop()
    },
    onError: () => {
      authService.stopRefreshLoop()
    }
  })
}

export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      authService.stopRefreshLoop()
      localStorage.removeItem('user')
    }
  })
}