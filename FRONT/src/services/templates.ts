import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { userApi } from '../api/user.api'
import type { User } from '../types/user.type'


/**
 * Service class for user-related operations
*/
class UserService {
  /**
   * Get all users
  */
  public getAll(): UseQueryResult<User[], Error> {
    return useQuery<User[], Error>({
      queryKey: ['users'],
      queryFn: () => userApi.getAllUsers(),
    })
  }
  public findOne(id : string ): UseQueryResult<User | null, Error > {
    return useQuery<User | null, Error>({
      queryKey: ['users', id],
      queryFn: () => userApi.findOne(+id)
    })
  }
}

/**
 * Exported instance of the UserService class
*/
export const userService = new UserService()