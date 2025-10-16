# Guide d'Installation et d'Exécution - Application Client JO Front

## Prérequis Système

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

## Installation

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
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Configuration de l'application
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=auth_refresh_token

# Mode de développement
NODE_ENV=development
```

> **Note** : Adaptez les URLs selon votre configuration backend

## Exécution du Projet

Attention l'API Backend doit etre en fonctionnement

### Mode Développement

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**


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

## Résolution de Problèmes

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

*Cette documentation est maintenue à jour avec chaque version. Vérifiez régulièrement les mises à jour.*
