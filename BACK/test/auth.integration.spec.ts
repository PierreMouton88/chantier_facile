import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Charge les variables d'environnement de test avant tout
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'mysql://root:test@localhost:3306/chantierfacile_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-integration';

describe('Auth (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Email unique par run pour éviter les collisions entre tests
  const testEmail = `test_${Date.now()}@integration.com`;
  const testPassword = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Reproduire exactement la config de main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    );
    app.use((cookieParser as unknown as () => unknown)() as any);

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Nettoyage : supprimer l'utilisateur créé pendant les tests
    await prisma.user
      .deleteMany({ where: { email: testEmail } })
      .catch(() => null);

    await app.close();
  });

  // ─── POST /auth/signup ────────────────────────────────────────────────────

  describe('POST /auth/signup', () => {
    it('400 — body vide', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({})
        .expect(400);
    });

    it('400 — email invalide', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'pas-un-email', password: testPassword, first_name: 'Test' })
        .expect(400);
    });

    it('400 — mot de passe trop court (< 8 chars)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: testEmail, password: '123', first_name: 'Test' })
        .expect(400);
    });

    it('201 — inscription réussie + cookies posés', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: testEmail, password: testPassword, first_name: 'Test' })
        .expect(201);

      // Les cookies httpOnly doivent être présents dans Set-Cookie
      const cookies = ([] as string[]).concat(res.headers['set-cookie'] ?? []);
      const cookieStr = cookies.join(';');
      expect(cookieStr).toContain('access_token');
      expect(cookieStr).toContain('refresh_token');

      // La réponse doit contenir les données user
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('409 — email déjà utilisé', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: testEmail, password: testPassword, first_name: 'Test' })
        .expect(409);
    });
  });

  // ─── POST /auth/signin ────────────────────────────────────────────────────

  describe('POST /auth/signin', () => {
    it('400 — body vide', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({})
        .expect(400);
    });

    it('401 — email inconnu', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'inconnu@nowhere.com', password: testPassword })
        .expect(401);
    });

    it('401 — mauvais mot de passe', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: testEmail, password: 'mauvais_password' })
        .expect(401);
    });

    it('201 — connexion réussie + cookies posés', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: testEmail, password: testPassword })
        .expect(201);

      const cookies = ([] as string[]).concat(res.headers['set-cookie'] ?? []);
      const cookieStr = cookies.join(';');
      expect(cookieStr).toContain('access_token');
      expect(cookieStr).toContain('refresh_token');

      expect(res.body.user.email).toBe(testEmail);
    });
  });

  // ─── GET /auth/me ─────────────────────────────────────────────────────────

  describe('GET /auth/me', () => {
    it('401 — sans cookie', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('200 — avec cookie access_token valide', async () => {
      // D'abord on se connecte pour récupérer le cookie
      const signinRes = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: testEmail, password: testPassword });

      const cookies = ([] as string[]).concat(signinRes.headers['set-cookie'] ?? []);
      const accessTokenCookie = cookies.find((c) => c.startsWith('access_token'));
      expect(accessTokenCookie).toBeDefined();

      const meRes = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', accessTokenCookie!)
        .expect(200);

      expect(meRes.body.email).toBe(testEmail);
    });
  });

  // ─── POST /auth/logout ────────────────────────────────────────────────────

  describe('POST /auth/logout', () => {
    it('200 — sans cookie (logout tolérant)', () => {
      return request(app.getHttpServer()).post('/auth/logout').expect(201);
    });

    it('200 — avec cookie, cookies effacés en réponse', async () => {
      // Connexion pour obtenir les cookies
      const signinRes = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: testEmail, password: testPassword });

      const cookies = ([] as string[]).concat(signinRes.headers['set-cookie'] ?? []);

      const logoutRes = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', cookies.join('; '))
        .expect(201);

      expect(logoutRes.body.ok).toBe(true);

      // Les cookies doivent être supprimés (Max-Age=0 ou Expires dans le passé)
      const logoutCookies = ([] as string[]).concat(logoutRes.headers['set-cookie'] ?? []);
      const cookieStr = logoutCookies.join(';');
      expect(cookieStr).toContain('access_token');
      expect(cookieStr).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/);
    });
  });
});
