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
    retry: false,
    retryOnMount: false, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export const useSignupCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'me'], response.user)
    },
  })
}

export const useSignupEntreprise = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, EntrepriseSignupData>({
    mutationFn: (data: EntrepriseSignupData) => authApi.signupEntreprise(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'me'], response.user)
    },
  })
}

export const useSignIn = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, SigninData>({
    mutationFn: (data: SigninData) => authApi.signin(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'me'], response.user)
    },
  })
}

export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      authService.stopRefreshLoop()
    }
  })
}
