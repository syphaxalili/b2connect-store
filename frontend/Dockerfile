# --- Étape 1 : Build (Construction) ---
FROM node:20-alpine AS build

# Accepter les arguments de build depuis docker-compose
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Les rendre disponibles comme variables d'environnement pour npm run build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

WORKDIR /app

# Copier les dépendances et installer
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application de production (Vite lira les ENV VITE_*)
RUN npm run build

# --- Étape 2 : Serve (Service) ---
FROM nginx:stable-alpine

# Copier les fichiers statiques buildés de l'étape 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx (cruciale pour React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
