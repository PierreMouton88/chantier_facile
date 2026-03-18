import { SetMetadata } from '@nestjs/common';
import { userRole } from '../../user/enum/role.enum';

export const ROLES_KEY = 'roles';
// Décorateur pour définir les rôles requis sur un endpoint
export const Roles = (...roles: userRole[]) => SetMetadata('roles', roles);
