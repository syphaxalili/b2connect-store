# 🚀 Pipeline CI/CD - B2CONNECT STORE

Ce pipeline GitHub Actions automatise les tests, la construction et le déploiement de l'application.

## 📋 Workflow

Le pipeline se déclenche automatiquement à chaque push sur la branche `main` et exécute 3 jobs séquentiels :

### 1️⃣ **Test** - Tests d'Intégration Backend
- ✅ Lance une instance MySQL 8.0 temporaire
- ✅ Exécute 66 tests d'intégration (auth, password reset, middleware)
- ✅ Génère un rapport de couverture de code
- ✅ Upload le rapport de couverture comme artifact (30 jours de rétention)

**Technologies testées :**
- Node.js 20
- MySQL 8.0 (service GitHub Actions)
- MongoDB Atlas (via secrets)
- Jest + Supertest

### 2️⃣ **Build** - Construction des Images Docker
- 🐳 Construit l'image Docker du backend
- 🐳 Construit l'image Docker du frontend
- 📦 Pousse les images vers GitHub Container Registry (GHCR)

**Dépendance :** Ce job ne s'exécute que si les tests passent ✅

### 3️⃣ **Deploy** - Déploiement sur VPS
- 🔐 Se connecte au VPS via SSH
- 📥 Pull les dernières images Docker depuis GHCR
- 🔄 Redémarre les conteneurs avec `docker compose up -d`
- 🧹 Nettoie les anciennes images

**Dépendance :** Ce job ne s'exécute que si le build réussit ✅

---

## 🔑 Secrets GitHub Requis

Pour que le pipeline fonctionne, configurez ces secrets dans **Settings > Secrets and variables > Actions** :

### Base de Données
- `MONGODB_URI_TEST` - URI MongoDB Atlas pour les tests (ex: `mongodb+srv://user:pass@cluster.mongodb.net/b2connect_test`)

### Stripe (optionnel pour les tests)
- `STRIPE_SECRET_KEY` - Clé secrète Stripe de test

### GitHub Container Registry
- `GHCR_USER` - Nom d'utilisateur GitHub
- `GHCR_TOKEN` - Personal Access Token avec permissions `write:packages`

### VPS Déploiement
- `VPS_HOST` - Adresse IP ou domaine du VPS
- `VPS_USER` - Nom d'utilisateur SSH
- `VPS_SSH_KEY` - Clé privée SSH pour l'authentification

---

## 📊 Rapport de Couverture

Le rapport de couverture de code est généré automatiquement et disponible dans les **Artifacts** de chaque run :

1. Aller dans **Actions** > Sélectionner un workflow run
2. Descendre jusqu'à **Artifacts**
3. Télécharger `coverage-report`
4. Ouvrir `coverage/lcov-report/index.html` dans un navigateur

---

## 🛠️ Exécution Locale des Tests

Pour reproduire l'environnement CI en local :

```bash
# 1. Démarrer MySQL de test
docker-compose -f docker-compose.test-db-only.yml up -d

# 2. Attendre que MySQL soit prêt (15 secondes)
timeout /t 15

# 3. Lancer les tests
cd backend
npm test

# 4. Générer le rapport de couverture
npm run test:coverage
```

---

## 🔍 Debugging

### Les tests échouent en CI mais passent en local ?
- Vérifiez que `MONGODB_URI_TEST` est bien configuré dans les secrets GitHub
- Vérifiez que le secret pointe vers une base MongoDB de test (pas production)

### Le build échoue ?
- Vérifiez que `GHCR_USER` et `GHCR_TOKEN` sont corrects
- Vérifiez que le token a les permissions `write:packages`

### Le déploiement échoue ?
- Vérifiez la connexion SSH au VPS
- Vérifiez que Docker et Docker Compose sont installés sur le VPS
- Vérifiez que le répertoire `/var/www/b2connect-store` existe

---

## 📈 Statistiques

- **66 tests d'intégration** couvrant :
  - 23 tests d'authentification (register, login, logout, refresh, /me)
  - 21 tests de réinitialisation de mot de passe
  - 17 tests de middleware (protect, requireAdmin, sécurité)
  - 5 tests de scénarios complets

- **Temps d'exécution moyen :** ~45 secondes pour les tests

---

## 🎯 Améliorations Futures

- [ ] Ajouter des tests E2E avec Playwright
- [ ] Ajouter des tests de charge/performance
- [ ] Intégrer SonarQube pour l'analyse de code
- [ ] Ajouter des notifications Slack/Discord sur échec
- [ ] Déploiement automatique sur environnement de staging
