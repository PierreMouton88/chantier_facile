import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TokensService } from './services/tokens.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    // Orchestration et logique métier d'authentification
    AuthService,
    // Inscription transactionnelle (user, profil, addresse, professions)
    TokensService,
    // Accès base Prisma
    PrismaService,
    // Protection par cookie access_token
    AuthGuard,
    // Contrôle d'accès basé sur les rôles
    RolesGuard,
  ],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
