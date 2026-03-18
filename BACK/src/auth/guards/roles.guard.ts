import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRole } from '../../user/enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupère les rôles requis depuis les métadonnées du handler/contrôleur
    const requiredRoles = this.reflector.getAllAndOverride<userRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const reqObj = context.switchToHttp().getRequest();
    const user = reqObj.user;
    // Si l'utilisateur n'existe pas ou n'a pas de rôle défini
    if (!user || !user.role) {
      throw new ForbiddenException('Accès refusé. Rôle non défini.');
    }

    // Si l'utilisateur est ADMIN, il a toujours accès (God Mode)
    if (user.role === userRole.Admin) {
      return true;
    }
    // 1. Normalisation du rôle utilisateur et des rôles requis
    const userRoleNormalized = user.role.toLowerCase().trim();
    const requiredRolesNormalized = requiredRoles.map((role) =>
      role.toLowerCase().trim(),
    );

    // 2. Ajout d'une vérification de rôle super-utilisateur sur la version normalisée
    if (userRoleNormalized === 'admin') {
      return true;
    }

    // 3. Vérification finale sur les valeurs normalisées (Ceci doit fonctionner !)
    const hasRequiredRole =
      requiredRolesNormalized.includes(userRoleNormalized);

    if (hasRequiredRole) {
      return true;
    }

    throw new ForbiddenException(
      `Accès refusé. Rôle requis : ${requiredRoles.join(' ou ')}.`,
    );

    // const hasRequiredRole = requiredRoles.includes(user.role);

    // if (hasRequiredRole) {
    //   return true;
    // }
    // throw new ForbiddenException(
    //   `Accès refusé. Rôle requis : ${requiredRoles.join(' ou ')}.`,
    // );
  }
}
