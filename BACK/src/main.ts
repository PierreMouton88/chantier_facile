import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime automatiquement les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: false, // Ne rejette pas la requête, supprime juste les propriétés
      transform: true, // Transforme automatiquement les payloads en instances DTO
    }),
  );
  // Installe le middleware pour lire les cookies des requêtes
  app.use((cookieParser as unknown as () => unknown)() as any);
  app.enableCors({
    origin: process.env.URL_FRONT,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
