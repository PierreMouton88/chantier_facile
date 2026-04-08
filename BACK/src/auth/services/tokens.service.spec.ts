import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('TokensService', () => {
  let service: TokensService;
  let jwt: JwtService;
  let prisma: PrismaService;

  // Mock de transaction Prisma : exécute le callback directement
  const mockTx = {
    refreshToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockTx.refreshToken.findMany.mockReset();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-token');
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt'),
            verify: jest.fn().mockReturnValue({ sub: 1 }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            refreshToken: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
            },
            $transaction: jest.fn((cb) => cb(mockTx)),
          },
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    jwt = module.get<JwtService>(JwtService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // ─── buildTokens ───────────────────────────────────────────────

  describe('buildTokens', () => {
    it('should return an accessToken and a refreshToken', () => {
      const result = service.buildTokens(1, Role.customer);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should sign accessToken with expiresIn 15m', () => {
      service.buildTokens(1, Role.customer);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 1, role: Role.customer },
        { expiresIn: '15m' },
      );
    });

    it('should sign refreshToken with expiresIn 7d', () => {
      service.buildTokens(1, Role.customer);

      expect(jwt.sign).toHaveBeenCalledWith({ sub: 1 }, { expiresIn: '7d' });
    });
  });

  // ─── issueForUser ──────────────────────────────────────────────

  describe('issueForUser', () => {
    it('should revoke existing active tokens', async () => {
      await service.issueForUser(1, Role.customer);

      expect(mockTx.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ user_id: 1, revoked: false }),
          data: expect.objectContaining({ revoked: true }),
        }),
      );
    });

    it('should create a new hashed refresh token', async () => {
      await service.issueForUser(1, Role.customer);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockTx.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            user_id: 1,
            token_hash: 'hashed-token',
            revoked: false,
          }),
        }),
      );
    });

    it('should return the generated tokens', async () => {
      const result = await service.issueForUser(1, Role.customer);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  // ─── rotateFromValue ───────────────────────────────────────────

  describe('rotateFromValue', () => {
    it('should return new tokens when refresh token matches an active token', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: Role.customer,
      });
      mockTx.refreshToken.findMany
        .mockResolvedValueOnce([{ id: 10, token_hash: 'stored-hash' }]) // actifs
        .mockResolvedValueOnce([]); // révoqués (pour la détection de réutilisation)
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true); // match trouvé

      const result = await service.rotateFromValue('valid-refresh-token');

      expect(result).not.toBeNull();
      expect(result?.tokens).toHaveProperty('accessToken');
      expect(result?.tokens).toHaveProperty('refreshToken');
      expect(mockTx.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 10 },
          data: expect.objectContaining({ revoked: true }),
        }),
      );
    });

    it('should revoke ALL tokens on reuse attack detection', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: Role.customer,
      });
      // Aucun token actif ne matche → le token est peut-être révoqué (réutilisation)
      mockTx.refreshToken.findMany
        .mockResolvedValueOnce([]) // aucun actif ne matche
        .mockResolvedValueOnce([{ id: 20, token_hash: 'revoked-hash' }]); // révoqués
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true); // match sur révoqué = réutilisation

      const result = await service.rotateFromValue('reused-token');

      expect(result).toBeNull();
      expect(mockTx.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 1, revoked: false },
          data: expect.objectContaining({ revoked: true }),
        }),
      );
    });

    it('should return null if user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.rotateFromValue('any-token');

      expect(result).toBeNull();
    });
  });
});
