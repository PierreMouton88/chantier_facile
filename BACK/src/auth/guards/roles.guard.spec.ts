import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { userRole } from '../../user/enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Fabrique un ExecutionContext mocké avec un user injecté
function mockContext(user: any) {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as any;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required (@Roles absent)', async () => {
    // Simule une route sans décorateur @Roles()
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);
    const context = mockContext({ role: userRole.Customer });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when required roles array is empty', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([]);
    const context = mockContext({ role: userRole.Customer });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow admin access regardless of required roles (god mode)', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([userRole.Customer]);
    const context = mockContext({ role: userRole.Admin }); // admin essaie d'accéder à route customer

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user has the required role', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([userRole.Customer]);
    const context = mockContext({ role: userRole.Customer });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user has one of multiple required roles', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      userRole.Customer,
      userRole.Entreprise,
    ]);
    const context = mockContext({ role: userRole.Entreprise });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user role does not match', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([userRole.Admin]);
    const context = mockContext({ role: userRole.Customer });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user is not defined on request', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([userRole.Customer]);
    const context = mockContext(null); // pas de user sur la requête

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user has no role', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([userRole.Customer]);
    const context = mockContext({ id: 1 }); // user sans propriété role

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
