import type { Role } from './user.type'

export type PrivateRouteProps = {
  allowed?: readonly Role[]
  redirectTo?: string
}