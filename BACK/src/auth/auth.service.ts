import { UserService } from './../user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { TokensService } from './services/tokens.service';
//import { UserViewService } from './services/user-view.service';
import { UserWithProfileDto } from './dto/user-with-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokens: TokensService,
    private user: UserService,
  ) {}

  // ----------- Inscription | Création d'utilisateur -----------

  // Inscription client
  async signupCustomer(dto: SignupDto) {
    return this.signup(dto, Role.customer);
  }

  // Inscription entreprise
  async signupEntreprise(dto: SignupDto) {
    return this.signup(dto, Role.entreprise);
  }

  async signup(body: SignupDto, role: Role) {
    // Vérifier si email existe déjà
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new ConflictException('Email déjà utilisé');
    }
    const saltRounds = parseInt(process.env.HashSalt || '10', 10);
    // TODO: remettre le salt et le hash dans le .env
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const now = new Date();
    try {
      // Transaction atomique
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Créer User
        const user = await tx.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            role,
            is_validated: false,
            created_at: now,
            updated_at: now,
          },
        });

        // 2. Créer Address
        const address = await tx.address.create({
          data: {
            address_line_1: body.address_line_1 ?? '',
            zip_code: body.zip_code ?? '',
            city: body.city ?? '',
            country: body.country ?? '',
            created_at: now,
            updated_at: now,
          },
        });

        // 3. Créer Profile
        await tx.profile.create({
          data: {
            first_name: body.first_name ?? 'User',
            name: body.name ?? body.first_name,
            phone_number: body.phone_number ?? null,
            is_newbie: body.is_newbie ?? false,
            company_name: body.company_name ?? null,
            siret: body.siret ?? null,
            user_id: user.id,
            created_at: now,
            updated_at: now,
          },
        });

        // 4. Lier user ↔ address
        await tx.userHasAddresses.create({
          data: {
            user_id: user.id,
            address_id: address.id,
            created_at: now,
            updated_at: now,
          },
        });

        // 5. Attacher les professions (si noms fournis)
        if (body.professionNames && body.professionNames.length > 0) {
          const uniqueNames = Array.from(new Set(body.professionNames));

          const professions = await tx.profession.findMany({
            where: { profession_name: { in: uniqueNames } },
          });
          if (professions.length !== uniqueNames.length) {
            const found = professions.map((p) => p.profession_name);
            const missing = uniqueNames.filter((n) => !found.includes(n));
            console.warn(`Professions introuvables : ${missing.join(', ')}`);
          }
          if (professions.length > 0) {
            await tx.userHasProfession.createMany({
              data: professions.map((profession) => ({
                user_id: user.id,
                profession_id: profession.id,
                created_at: now,
                updated_at: now,
              })),
              skipDuplicates: true,
            });
          }
        }

        return { userId: user.id };
      });

      // 5. Générer tokens après transaction
      const tokens = await this.tokens.issueForUser(result.userId, role);

      // 6. Récupérer user complet avec profil
      const userWithProfile = await this.user.getcompleteUser(result.userId);

      return { tokens, user: userWithProfile };
    } catch (e: any) {
      // Gestion des erreurs Prisma
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = Array.isArray(e.meta?.target)
          ? e.meta.target.join(', ')
          : JSON.stringify(e.meta?.target ?? 'champ');

        if (target.includes('email')) {
          throw new ConflictException('Email déjà utilisé');
        }
        if (target.includes('siret')) {
          throw new ConflictException('SIRET déjà utilisé');
        }
        throw new ConflictException(`Conflit sur : ${target}`);
      }
      throw e;
    }
  }
  // ----------- Authentification & Tokens -----------

  // Connexion utilisateur
  async signin(
    email: string,
    password: string,
    _existingRefreshToken?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');
    const tokens = await this.tokens.issueForUser(user.id, user.role);
    const userView = await this.user.getcompleteUser(user.id);
    return { tokens, user: userView };
  }

  async revokeRefreshToken(refreshToken: string) {
    // Révocation d'un refresh token fourni (si valide et actif)
    await this.tokens.revokeByValue(refreshToken);
  }

  // Rafraîchissement du token
  async refreshFromToken(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token manquant');
    // Rotation + détection de réutilisation, renvoie nouveaux tokens et user
    const out = await this.tokens.rotateFromValue(refreshToken);
    if (!out) throw new UnauthorizedException('Refresh token invalide');
    return out;
  }

  async getUserFromToken(accessToken: string): Promise<UserWithProfileDto> {
    //Check du accestoken
    if (!accessToken)
      throw new UnauthorizedException('Non authentifié : Jeton manquant.');
    //payload
    let payload: { sub: number };
    try {
      payload = this.tokens.verify(accessToken) as { sub: number };
    } catch {
      throw new UnauthorizedException('Non authentifié, introuvable');
    }
    //Récupération de user par son id avec payload

    const user = await this.user.getcompleteUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Non authentifié : Utilisateur introuvable ou désactivé.',
      );
    }
    return user;
  }
  private readonly maxAgeAT = 15 * 60 * 1000;
  private readonly maxAgeRT = 7 * 24 * 60 * 60 * 1000;
  // Gestion des cookies d'authentification
  public setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: this.maxAgeAT,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/auth/refresh',
      maxAge: this.maxAgeRT,
    });
  }
  public removeAuthCookies(res: Response) {
    const secure = process.env.NODE_ENV === 'production';
    // Supprime access_token (path: '/')
    res.cookie('access_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
    });

    // Supprime refresh_token avec le MÊME path que lors de la création
    res.cookie('refresh_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/auth/refresh', // ✅ IMPORTANT: même path qu'à la création
      maxAge: 0,
    });
  }
}
