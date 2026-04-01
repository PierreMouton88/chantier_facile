import { useEffect } from 'react'
import { useMe } from './useAuth'
import { authService } from '../services/auth.services'

export const useAuthInit = () => {
  const { data: user } = useMe()

  useEffect(() => {
    if (user) {
      authService.startRefreshLoop()
    } else {
      authService.stopRefreshLoop()
    }

    return () => {
      authService.stopRefreshLoop()
    }
  }, [user])
}
