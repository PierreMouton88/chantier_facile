# 🏗️ ÉTAPE 1 : Construction (Build)
FROM node:20-alpine AS builder

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installe toutes les dépendances (prod + dev)
RUN npm install

# Copie tout le code source
COPY . .

# Génère le client Prisma (DATABASE_URL fictive, juste nécessaire pour la génération)
ENV DATABASE_URL="mysql://fake:fake@localhost:3306/fake"
RUN npx prisma generate

# Compile le code TypeScript en JavaScript
RUN npm run build

# 🚀 ÉTAPE 2 : Production (Runtime)
FROM node:20-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installe SEULEMENT les dépendances de production
RUN npm install --omit=dev

# Copie le code compilé depuis l'étape builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose le port 3000
EXPOSE 3000

# Lance l'application en mode production
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
