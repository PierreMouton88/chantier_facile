import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserWithProfileDto } from '../dto/user-with-profile.dto';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extrait le cookie 'refresh_token' et valide l'utilisateur courant
    const reqObj = context.switchToHttp().getRequest<{
      cookies?: Record<string, unknown>;
      user?: UserWithProfileDto;
    }>();
    const accessToken = reqObj.cookies?.access_token;
    try {
      const token = typeof accessToken === 'string' ? accessToken : '';
      if (!token) throw new UnauthorizedException('Non authentifié');
      const user: UserWithProfileDto = await this.auth.getUserFromToken(token);
      reqObj.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Erreur authentification interne.');
    }
  }
}
