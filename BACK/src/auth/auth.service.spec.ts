import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from './services/tokens.service';
import { UserService } from '../user/user.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
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
    first_name: 'Jean',
    name: 'Dupont',
    phone_number: '0612345678',
    address_line_1: '123 Rue de la Paix',
    zip_code: '75001',
    city: 'Paris',
    country: 'France',
  };

  const mockUser = { id: 1 };
  const mockAddress = { id: 1 };
  const mockProfile = { user_id: 1 };
  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };
  const mockUserWithProfile = {
    id: 1,
    email: 'jean@example.com',
    role: Role.customer,
    profile: { user_id: 1, first_name: 'Jean', name: 'Dupont' },
  };

  const mockTx = {
    user: { create: jest.fn().mockResolvedValue(mockUser) },
    address: { create: jest.fn().mockResolvedValue(mockAddress) },
    profile: { create: jest.fn().mockResolvedValue(mockProfile) },
    userHasAddresses: { create: jest.fn() },
    userHasProfession: { createMany: jest.fn() },
    profession: { findMany: jest.fn() },
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
          first_name: 'Jean',
          user_id: 1,
        }),
      }),
    );
    expect(mockTx.userHasAddresses.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
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
    expect(mockTx.userHasProfession.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            user_id: 1,
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

//test du sign in et du refresh token dans le même fichier pour éviter de devoir mocker les mêmes fonctions à plusieurs endroits

describe('AuthService - signin', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let tokens: TokensService;

  const mockUser = {
    id: 1,
    email: 'jean@example.com',
    password: 'hashed-password',
    role: Role.customer,
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockUserWithProfile = {
    id: 1,
    email: 'jean@example.com',
    role: Role.customer,
    profile: { user_id: 1, first_name: 'Jean', name: 'Dupont' },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            $transaction: jest.fn(),
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
  });

  it('should throw UnauthorizedException if email does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.signin('unknown@example.com', 'anypassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.signin('jean@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return the same error message for wrong email and wrong password', async () => {
    // Email inexistant
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.signin('unknown@example.com', 'anypassword'),
    ).rejects.toThrow('Identifiants invalides');

    // Mauvais mot de passe
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(
      service.signin('jean@example.com', 'wrongpassword'),
    ).rejects.toThrow('Identifiants invalides');
  });

  it('should call issueForUser with correct userId and role on success', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await service.signin('jean@example.com', 'ValidPass123!');

    expect(tokens.issueForUser).toHaveBeenCalledWith(1, Role.customer);
  });

  it('should return tokens and user on successful signin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.signin('jean@example.com', 'ValidPass123!');

    expect(result.tokens).toEqual(mockTokens);
    expect(result.user).toEqual(mockUserWithProfile);
  });
});
