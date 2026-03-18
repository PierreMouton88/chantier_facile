import { Body, Controller, Post, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDeletionService } from '../user/services/user-deletion.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly maxAgeAT = 15 * 60 * 1000;
  private readonly maxAgeRT = 7 * 24 * 60 * 60 * 1000;
  constructor(
    private readonly authService: AuthService,
    private readonly userDeletion: UserDeletionService,
  ) {}

  // Inscription client et pose des cookies
  @Post('signup')
  async signupUser(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const out = await this.authService.signupCustomer(dto);
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  // Inscription entreprise (mapping du body vers DTO) et pose des cookies
  @Post('signup-entreprise')
  async signupEntreprise(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const out = await this.authService.signupEntreprise(dto);
    this.authService.setAuthCookies(res, out.tokens);
    return out;
  }

  // Connexion utilisateur et pose des cookies
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

  // Rafraîchissement du token via cookie 'refresh_token'
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

  // Retourne la vue utilisateur à partir du cookie 'access_token'
  @Get('me')
  async me(@Req() req: Request) {
    const reqObj = req as unknown as {
      cookies?: Record<string, unknown>;
    };
    const accessToken = reqObj.cookies?.access_token;
    const token = typeof accessToken === 'string' ? accessToken : '';
    const user = await this.authService.getUserFromToken(token);
    //console.log(user);
    return user;
  }

  // Déconnexion: révocation du refresh token et suppression des cookies
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
