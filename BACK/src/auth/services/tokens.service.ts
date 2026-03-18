import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TokensService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  // Génération des tokens JWT
  buildTokens(userId: number, role: Role) {
    const accessToken = this.jwt.sign(
      { sub: userId, role },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwt.sign({ sub: userId }, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  // Vérification du token JWT
  verify(token: string): any {
    try {
      const payload = this.jwt.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }

  // Émet des tokens pour un utilisateur et stocke le refresh token (hashé)
  async issueForUser(userId: number, role: Role) {
    const tokens = this.buildTokens(userId, role);
    const now = new Date();
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.updateMany({
        where: {
          user_id: userId,
          revoked: false,
          expires_at: { gte: now },
        },
        data: { revoked: true, updated_at: now },
      });
      await tx.refreshToken.create({
        data: {
          user_id: userId,
          token_hash: hashedRefresh,
          revoked: false,
          expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          created_at: now,
          updated_at: now,
        },
      });
      await tx.refreshToken.deleteMany({
        where: {
          user_id: userId,
          OR: [{ revoked: true }, { expires_at: { lt: now } }],
        },
      });
    });
    return tokens;
  }

  // Révoque un refresh token actif correspondant à la valeur fournie
  async revokeByValue(refreshToken: string) {
    if (!refreshToken) return;
    let payload: { sub: number } | null = null;
    try {
      payload = this.verify(refreshToken) as { sub: number };
    } catch {
      return;
    }
    const now = new Date();
    await this.prisma.$transaction(async (prismaTx) => {
      const actives = await prismaTx.refreshToken.findMany({
        where: {
          user_id: payload.sub,
          revoked: false,
          expires_at: { gte: now },
        },
        select: { id: true, token_hash: true },
      });
      for (const rt of actives) {
        const ok = await bcrypt.compare(refreshToken, rt.token_hash);
        if (ok) {
          await prismaTx.refreshToken.update({
            where: { id: rt.id },
            data: { revoked: true, updated_at: now },
          });
          break;
        }
      }
    });
  }

  // Effectue la rotation du refresh token, détecte la réutilisation et purge
  async rotateFromValue(refreshToken: string) {
    const payload = this.verify(refreshToken) as { sub: number };
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });
    if (!user) return null;
    const now = new Date();
    const match = await this.prisma.$transaction(async (prismaTx) => {
      const actives = await prismaTx.refreshToken.findMany({
        where: { user_id: user.id, revoked: false, expires_at: { gte: now } },
        select: { id: true, token_hash: true },
      });
      for (const rt of actives) {
        const ok = await bcrypt.compare(refreshToken, rt.token_hash);
        if (ok) {
          const tokens = this.buildTokens(user.id, user.role);
          const newHash = await bcrypt.hash(tokens.refreshToken, 10);
          await prismaTx.refreshToken.update({
            where: { id: rt.id },
            data: { revoked: true, updated_at: now },
          });
          await prismaTx.refreshToken.create({
            data: {
              user_id: user.id,
              token_hash: newHash,
              revoked: false,
              expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
              created_at: now,
              updated_at: now,
            },
          });
          return tokens;
        }
      }
      const revoked = await prismaTx.refreshToken.findMany({
        where: { user_id: user.id, revoked: true },
        select: { id: true, token_hash: true },
      });
      for (const rt of revoked) {
        const reuse = await bcrypt.compare(refreshToken, rt.token_hash);
        if (reuse) {
          await prismaTx.refreshToken.updateMany({
            where: { user_id: user.id, revoked: false },
            data: { revoked: true, updated_at: now },
          });
          break;
        }
      }
      return null;
    });
    if (!match) return null;
    return { tokens: match, user: { email: user.email, role: user.role } };
  }

  // Émet et insère un refresh token dans une transaction existante (inscription)
  async issueWithinTransaction(
    tx: Prisma.TransactionClient,
    userId: number,
    role: Role,
    now?: Date,
  ) {
    const tokens = this.buildTokens(userId, role);
    const ts = now ?? new Date();
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await tx.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: hashedRefresh,
        revoked: false,
        expires_at: new Date(ts.getTime() + 7 * 24 * 60 * 60 * 1000),
        created_at: ts,
        updated_at: ts,
      },
    });
    return tokens;
  }
}
