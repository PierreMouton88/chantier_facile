import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDeletionService } from '../user/services/user-deletion.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import type { Request, Response } from 'express';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly maxAgeAT = 15 * 60 * 1000;
  private readonly maxAgeRT = 7 * 24 * 60 * 60 * 1000;
  constructor(
    private readonly authService: AuthService,
    private readonly userDeletion: UserDeletionService,
  ) {}

  // 5 tentatives par minute — protection brute force sur 3 routes sensibles (2 signups et signin)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup')
  async signupUser(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const out = await this.authService.signupCustomer(dto);
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup-entreprise')
  async signupEntreprise(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const out = await this.authService.signupEntreprise(dto);
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const reqCookies = req as unknown as {
      cookies?: Record<string, unknown>;
    };
    const cookies = reqCookies.cookies;
    const existingRefresh =
      typeof cookies?.refresh_token === 'string'
        ? cookies.refresh_token
        : undefined;
    const out = await this.authService.signin(
      dto.email,
      dto.password,
      existingRefresh,
    );
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  @SkipThrottle()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const reqCookies = req as unknown as {
      cookies?: Record<string, unknown>;
    };
    const cookies = reqCookies.cookies;
    const refreshToken =
      typeof cookies?.refresh_token === 'string' ? cookies.refresh_token : '';
    const out = await this.authService.refreshFromToken(refreshToken);
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  @SkipThrottle()
  @Get('me')
  async me(@Req() req: Request) {
    const reqObj = req as unknown as {
      cookies?: Record<string, unknown>;
    };
    const accessToken = reqObj.cookies?.access_token;
    const token = typeof accessToken === 'string' ? accessToken : '';
    const user = await this.authService.getUserFromToken(token);
    return user;
  }

  @SkipThrottle()
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const reqCookies = req as unknown as { cookies?: Record<string, unknown> };
    const cookies = reqCookies.cookies;
    const refreshToken =
      typeof cookies?.refresh_token === 'string' ? cookies.refresh_token : '';
    await this.authService.revokeRefreshToken(refreshToken);
    this.authService.removeAuthCookies(res);
    return { ok: true };
  }
}
