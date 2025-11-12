FROM node:20-alpine

# Installer l'outil de healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copier les dépendances et installer
COPY package*.json ./
RUN npm install --production # Ne pas installer les devDependencies

# Copier le reste du code source
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["node", "server.js"]
