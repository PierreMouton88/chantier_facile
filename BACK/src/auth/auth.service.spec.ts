import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from './services/tokens.service';
import { UserService } from '../user/user.service';
import { ConflictException } from '@nestjs/common';
import { Role, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService - signupCustomer', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let tokens: TokensService;
  let userService: UserService;

  const mockDto = {
    email: 'jean@example.com',
    password: 'ValidPass123!',
    firstName: 'Jean',
    name: 'Dupont',
    telephone: '0612345678',
    address_line_1: '123 Rue de la Paix',
    zip_code: '75001',
    city: 'Paris',
    country: 'France',
  };

  const mockUser = { id: 1 };
  const mockAddress = { id: 1 };
  const mockProfile = { id: 1 };
  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };
  const mockUserWithProfile = {
    id: 1,
    email: 'jean@example.com',
    role: Role.customer,
    profile: { id: 1, firstName: 'Jean', name: 'Dupont' },
  };

  // Transaction mock : exécute le callback avec un faux client Prisma
  const mockTx = {
    user: { create: jest.fn().mockResolvedValue(mockUser) },
    address: { create: jest.fn().mockResolvedValue(mockAddress) },
    profile: { create: jest.fn().mockResolvedValue(mockProfile) },
    profession: { findMany: jest.fn() },
    profileHasProfession: { createMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            $transaction: jest.fn((cb) => cb(mockTx)),
          },
        },
        {
          provide: TokensService,
          useValue: {
            issueForUser: jest.fn().mockResolvedValue(mockTokens),
          },
        },
        {
          provide: UserService,
          useValue: {
            getcompleteUser: jest.fn().mockResolvedValue(mockUserWithProfile),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    tokens = module.get<TokensService>(TokensService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call signup with Role.customer', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const spy = jest.spyOn(service, 'signup');
    await service.signupCustomer(mockDto);

    expect(spy).toHaveBeenCalledWith(mockDto, Role.customer);
  });

  it('should throw ConflictException if email already exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 99 });

    await expect(service.signupCustomer(mockDto)).rejects.toThrow(
      ConflictException,
    );
    await expect(service.signupCustomer(mockDto)).rejects.toThrow(
      'Email déjà utilisé',
    );
  });

  it('should hash the password', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await service.signupCustomer(mockDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('ValidPass123!', 10);
  });

  it('should create user, address and profile in a transaction', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await service.signupCustomer(mockDto);

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(mockTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'jean@example.com',
          password: 'hashed-password',
          role: Role.customer,
        }),
      }),
    );
    expect(mockTx.address.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          address_line_1: '123 Rue de la Paix',
          zip_code: '75001',
          city: 'Paris',
          country: 'France',
        }),
      }),
    );
    expect(mockTx.profile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          firstName: 'Jean',
          user_id: 1,
          address_id: 1,
        }),
      }),
    );
  });

  it('should issue tokens after user creation', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await service.signupCustomer(mockDto);

    expect(tokens.issueForUser).toHaveBeenCalledWith(1, Role.customer);
    expect(result.tokens).toEqual(mockTokens);
  });

  it('should return user with profile', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await service.signupCustomer(mockDto);

    expect(userService.getcompleteUser).toHaveBeenCalledWith(1);
    expect(result.user).toEqual(mockUserWithProfile);
  });

  it('should attach professions when professionNames are provided', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    mockTx.profession.findMany.mockResolvedValue([
      { id: 10, profession_name: 'Plombier' },
    ]);

    await service.signupCustomer({
      ...mockDto,
      professionNames: ['Plombier'],
    });

    expect(mockTx.profession.findMany).toHaveBeenCalledWith({
      where: { profession_name: { in: ['Plombier'] } },
    });
    expect(mockTx.profileHasProfession.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            profile_id: 1,
            profession_id: 10,
          }),
        ]),
      }),
    );
  });

  it('should throw ConflictException on Prisma P2002 (email)', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '6.0.0', meta: { target: ['email'] } },
    );
    (prisma.$transaction as jest.Mock).mockRejectedValue(prismaError);

    await expect(service.signupCustomer(mockDto)).rejects.toThrow(
      'Email déjà utilisé',
    );
  });

  it('should throw ConflictException on Prisma P2002 (siret)', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '6.0.0', meta: { target: ['siret'] } },
    );
    (prisma.$transaction as jest.Mock).mockRejectedValue(prismaError);

    await expect(service.signupCustomer(mockDto)).rejects.toThrow(
      'SIRET déjà utilisé',
    );
  });
});
