# ClientJO Front - Billetterie Jeux Olympiques Paris 2024

## Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies](#technologies)
- [Sécurité](#sécurité)
- [Architecture du projet](#architecture-du-projet)
- [Axes d'évolution futures](#axes-dévolution-futures)

## À propos du projet

ClientJO Front est l'interface client officielle pour la billetterie des Jeux Olympiques de Paris 2024. Cette application web permet aux spectateurs de découvrir, sélectionner et acheter leurs billets pour assister aux différentes épreuves olympiques dans les sites emblématiques de Paris et de l'Île-de-France. Développée dans le cadre d'un projet d'étude chez Studi, elle simule une plateforme professionnelle de vente de billets pour le plus grand événement sportif mondial.

## Fonctionnalités principales

### Système de billetterie
- Catalogue exhaustif des épreuves olympiques par discipline
- Sélection de créneaux horaires et de catégories de places
- Visualisation des disponibilités en temps réel

### Gestion des utilisateurs
- Inscription et authentification des spectateurs
- Profils utilisateurs avec historique des achats
- Gestion des sessions avec persistance des données

### Expérience d'achat
- Panier persistant avec sauvegarde automatique
- Génération de billets numériques avec QR codes

## Technologies

### Frontend moderne
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Développement type-safe
- **Tailwind CSS + DaisyUI** - Design system moderne

### Architecture & Qualité
- **Redux Toolkit** - Gestion d'état centralisée
- **Services API** - Intégration backend structurée
- **Tests automatisés** - Jest & Testing Library
- **Documentation** - TypeDoc intégrée

## Sécurité

### Authentification JWT
Le système d'authentification repose sur des tokens JWT (JSON Web Tokens) avec une architecture à double token :

- **Token d'accès** : JWT courte durée pour les requêtes API authentifiées
- **Token de rafraîchissement** : Token longue durée pour renouveler automatiquement l'accès

### Gestion sécurisée des tokens

**Stockage local sécurisé**
- Stockage des tokens dans le localStorage avec clés configurables via variables d'environnement
- Nettoyage automatique des tokens en cas d'expiration ou d'erreur
- Protection côté serveur avec vérifications `typeof window === 'undefined'`

**Validation automatique**
- Vérification de l'intégrité des tokens JWT via décodage Base64
- Contrôle de la date d'expiration (exp) avant chaque utilisation
- Gestion des erreurs de parsing avec fallback sécurisé

### Protection des routes et API

**Authentification automatique**
- Ajout automatique de l'en-tête `Authorization: Bearer <token>` sur toutes les requêtes authentifiées
- Redirection automatique vers la page de connexion pour les utilisateurs non authentifiés

**Gestion de l'expiration de session**
- Détection automatique des erreurs 401 (Unauthorized)
- Tentative de rafraîchissement automatique du token d'accès
- Nettoyage de session et notification utilisateur en cas d'échec du refresh
- Modal d'expiration de session pour informer l'utilisateur

### Architecture de sécurité

**Service d'authentification centralisé**
- Module authService dédié pour login, logout et refresh token
- Gestion centralisée des erreurs d'authentification
- Interface TypeScript stricte pour les credentials et réponses

**Wrappers de requêtes sécurisés**
- Fonction fetchApi avec gestion automatique de l'authentification
- Retry automatique avec nouveau token en cas de 401
- Gestion des erreurs HTTP avec messages détaillés et logging

### Protection côté client

**Validation des formulaires**
- Contrôles stricts sur les mots de passe (minimum 10 caractères, majuscules, minuscules, chiffres et caractères spéciaux)
- Validation des formats email et numéros de téléphone français
- Vérification de l'acceptation des conditions d'utilisation

**Gestion des événements de sécurité**
- Événement `tokenRefreshed` pour synchroniser les composants
- Callback `sessionExpired` pour notifications utilisateur
- Nettoyage automatique en cas de tokens compromis

## Architecture du projet

```
application/
├── src/
│   ├── app/              # Pages et routing Next.js
│   ├── components/       # Composants UI réutilisables
│   ├── context/          # Contextes React
│   ├── hook/             # Logique métier (hooks)
│   ├── lib/              # Services API et utilitaires
│   ├── store/            # Configuration Redux
│   ├── type/             # Définitions TypeScript
│   └── utils/            # Fonctions utilitaires
├── __tests__/            # Tests unitaires et d'intégration
└── public/               # Assets statiques
```

## Axes d'évolution futures

### Améliorations techniques

**Sécurité renforcée**
- Authentification multi-facteurs (2FA) : Renforcement de la sécurité pour les comptes utilisateurs
- Chiffrement des données sensibles : Protection renforcée des informations de paiement
- Rate limiting : Protection contre les attaques par déni de service

### Fonctionnalités métier avancées

**Expérience utilisateur enrichie**
- Recommandations personnalisées : Suggestions d'événements basées sur l'historique
- Wishlist : Système de favoris et alertes de disponibilité

**Gestion événementielle avancée**
- Réservations groupées : Faciliter l'achat pour familles et groupes
- Transfert de billets : Système sécurisé de revente entre utilisateurs

### Expérience utilisateur

**Interface moderne**
- Coherence UI : Reprendre l'interface pour toutes les pages du site sur le meme thème

### Intégrations

**Services externes**
- Passerelles de paiement : Intégration complète avec Stripe, PayPal
- Géolocalisation : Plans interactifs des sites olympiques

---
