# Guide d'Installation et d'Exécution - Application Client JO Front

## 📋 Prérequis Système

Avant de commencer l'installation, assurez-vous d'avoir les éléments suivants installés sur votre système :

### Obligatoire
- **Node.js** : Version 18.0 ou supérieure
  - [Télécharger Node.js](https://nodejs.org/)
  - Vérifiez votre version : `node --version`
- **npm** : Version 8.0 ou supérieure (inclus avec Node.js)
  - Vérifiez votre version : `npm --version`

### Recommandé
- **Git** : Pour cloner le repository
  - [Télécharger Git](https://git-scm.com/)
- **IDE/Éditeur** : Visual Studio Code, WebStorm, ou similaire
- **Navigateur moderne** : Chrome, Firefox, Safari, Edge

### Système d'exploitation
- ✅ **Windows** 10/11
- ✅ **macOS** 10.15+
- ✅ **Linux** (Ubuntu 18.04+, CentOS 7+)

## 🚀 Installation

### 1. Cloner le Repository

```bash
# Cloner le projet
git clone [URL_DU_REPOSITORY]

# Naviguer vers le dossier du projet
cd ClientJO_Front/application
```

### 2. Installation des Dépendances

```bash
# Installation de toutes les dépendances
npm install
```

Cette commande installera automatiquement :

#### Dépendances de Production
- **Next.js 15.3.1** : Framework React
- **React 19.0.0** : Bibliothèque UI
- **Redux Toolkit 2.9.0** : Gestion d'état
- **React-Redux 9.2.0** : Intégration Redux/React
- **Redux-Persist 6.0.0** : Persistance du store

#### Dépendances de Développement
- **TypeScript 5.8.3** : Typage statique
- **Tailwind CSS 4** : Framework CSS
- **DaisyUI 5.0.30** : Composants UI
- **ESLint 9** : Analyse de code
- **Jest 29.7.0** : Tests unitaires
- **TypeDoc 0.28.14** : Documentation

### 3. Configuration de l'Environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Créer le fichier d'environnement
touch .env.local
```

Ajoutez les variables d'environnement nécessaires :

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=10000

# Configuration de l'application
NEXT_PUBLIC_APP_NAME="Billetterie JO"
NEXT_PUBLIC_APP_VERSION="0.1.0"

# Mode de développement
NODE_ENV=development
```

> **Note** : Adaptez les URLs selon votre configuration backend

## ⚡ Exécution du Projet

### Mode Développement

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

#### Fonctionnalités du Mode Développement
- 🔄 **Hot Reload** : Rechargement automatique des modifications
- 🐛 **Source Maps** : Debugging facilité
- ⚠️ **Messages d'erreur détaillés** : Diagnostics complets
- 🔍 **React DevTools** : Compatible avec les outils React

### Mode Production

#### 1. Build de Production

```bash
npm run build
```

Cette commande :
- Compile le code TypeScript
- Optimise les assets (CSS, images, JS)
- Génère les pages statiques
- Minifie les fichiers
- Supprime les `console.log`

#### 2. Démarrage en Production

```bash
npm run start
```

L'application sera accessible à l'adresse : **http://localhost:3000**

## 🧪 Tests et Qualité de Code

### Exécution des Tests

```bash
# Tests en mode watch (développement)
npm run test:watch

# Tests unitaires (une fois)
npm run test

# Vérification complète (lint + types + tests)
npm run check
```

### Analyse de Code

```bash
# ESLint - Analyse du code
npm run lint

# TypeScript - Vérification des types
npx tsc --noEmit
```

## 📚 Documentation

### Génération de la Documentation

```bash
npm run docs:build
```

La documentation sera générée dans le dossier `docs/` et accessible via `docs/index.html`

## 🔧 Scripts Disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `dev` | Démarrage en mode développement | `npm run dev` |
| `build` | Build de production | `npm run build` |
| `start` | Démarrage en mode production | `npm run start` |
| `lint` | Analyse ESLint | `npm run lint` |
| `test` | Tests unitaires | `npm run test` |
| `test:watch` | Tests en mode watch | `npm run test:watch` |
| `check` | Vérification complète | `npm run check` |
| `docs:build` | Génération documentation | `npm run docs:build` |

## 🌐 Configuration des Ports

### Port par Défaut
- **Développement** : http://localhost:3000
- **Production** : http://localhost:3000

### Changement de Port

#### Via Variable d'Environnement
```bash
PORT=3001 npm run dev
```

#### Via Script Package.json
Modifiez le script dans `package.json` :
```json
{
  "scripts": {
    "start": "next start -p 3001"
  }
}
```

## 🗂️ Structure du Projet

```
application/
├── 📁 src/                    # Code source
│   ├── 📁 app/               # Pages Next.js (App Router)
│   ├── 📁 components/        # Composants React
│   ├── 📁 lib/              # Services et utilitaires
│   ├── 📁 store/            # Configuration Redux
│   └── 📁 styles/           # Styles globaux
├── 📁 public/               # Assets statiques
├── 📁 docs/                 # Documentation générée
├── 📄 package.json          # Dépendances et scripts
├── 📄 next.config.ts        # Configuration Next.js
├── 📄 tailwind.config.js    # Configuration Tailwind
├── 📄 tsconfig.json         # Configuration TypeScript
└── 📄 .env.local           # Variables d'environnement
```

## 🐛 Résolution de Problèmes

### Problèmes Courants

#### 1. Erreur "Module not found"
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port déjà utilisé
```bash
# Tuer le processus sur le port 3000
npx kill-port 3000

# Ou utiliser un autre port
PORT=3001 npm run dev
```

#### 3. Erreurs TypeScript
```bash
# Vérifier la configuration TypeScript
npx tsc --noEmit

# Nettoyer le cache TypeScript
rm -rf .next
npm run dev
```

#### 4. Erreurs de Build
```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run build
```

### Logs de Debug

#### Mode Développement
Les erreurs sont affichées directement dans :
- Console du navigateur
- Terminal de développement
- Overlay d'erreur Next.js

#### Mode Production
```bash
# Activer les logs détaillés
DEBUG=* npm run start
```

## 🔍 Vérification de l'Installation

### Checklist Post-Installation

- [ ] Node.js version ≥ 18.0
- [ ] npm install sans erreurs
- [ ] `npm run dev` démarre correctement
- [ ] Application accessible sur http://localhost:3000
- [ ] `npm run test` passe avec succès
- [ ] `npm run build` sans erreurs
- [ ] `npm run lint` sans warnings critiques

### Commandes de Vérification

```bash
# Vérifier les versions
node --version
npm --version

# Vérifier les dépendances
npm list --depth=0

# Test complet
npm run check
```

## 🚀 Déploiement

### Plateformes Recommandées

#### Vercel (Recommandé pour Next.js)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel
```

#### Netlify
```bash
# Build pour déploiement statique
npm run build
npm run export  # Si configuré
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## ⚙️ Configuration Avancée

### Variables d'Environnement Complètes

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=10000

# Application Settings
NEXT_PUBLIC_APP_NAME="Billetterie JO"
NEXT_PUBLIC_APP_VERSION="0.1.0"
NEXT_PUBLIC_DEBUG_MODE=false

# Redis/Cache (si applicable)
REDIS_URL=redis://localhost:6379

# Database (si applicable)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Mode et optimisations
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### Configuration Next.js Personnalisée

```typescript
// next.config.ts
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['example.com']
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ajoutez vos configurations personnalisées
}
```

## 📞 Support et Aide

### En cas de Problème

1. **Vérifiez la documentation** technique générée
2. **Consultez les logs** d'erreur détaillés
3. **Recherchez dans les issues** du repository
4. **Contactez l'équipe** de développement

### Ressources Utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

*Cette documentation est maintenue à jour avec chaque version. Vérifiez régulièrement les mises à jour.*
