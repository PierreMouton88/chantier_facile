# 🏗️ ÉTAPE 1 : Construction (Build)
FROM node:20-alpine AS builder

# Argument pour l'URL de l'API (passé depuis docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie tout le code source
COPY . .

# Build de production Vite
RUN npm run build

# 🚀 ÉTAPE 2 : Serveur Web (Nginx)
FROM nginx:alpine

# Copie les fichiers buildés dans le dossier de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie une config nginx personnalisée (pour le routing React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Nginx démarre automatiquement
CMD ["nginx", "-g", "daemon off;"]
