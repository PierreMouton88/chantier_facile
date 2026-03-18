import { defineConfig, env } from "prisma/config";
import "dotenv/config";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: (() => {
    const shadow = process.env.SHADOW_DATABASE_URL;
    return {
      url: env("DATABASE_URL"),
      ...(shadow ? { shadowDatabaseUrl: shadow } : {}),
    } as { url: string; shadowDatabaseUrl?: string };
  })(),
});
