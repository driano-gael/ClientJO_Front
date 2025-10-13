# Documentation Technique - Application Client JO Front

## Présentation du Projet

Cette application Next.js constitue le frontend client pour le système de billetterie des Jeux Olympiques. Elle permet aux utilisateurs de consulter les événements sportifs, sélectionner des offres de billets et effectuer leurs achats en ligne.

## Technologies Utilisées

- **Framework** : Next.js 14 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + DaisyUI
- **État Global** : Redux Toolkit
- **Tests** : Jest + React Testing Library
- **Documentation** : TypeDoc
- **Qualité de Code** : ESLint

## Architecture du Projet

### Structure des Dossiers

```
src/
├── app/                    # Pages et routes (App Router)
├── components/            # Composants React réutilisables
│   ├── common/           # Composants génériques
│   ├── connexion/        # Authentification
│   ├── evenements/       # Gestion des événements
│   └── header/           # Navigation
├── context/              # Contextes React
├── hook/                 # Hooks personnalisés
├── lib/                  # Services et utilitaires
│   ├── api/             # Services API
│   └── type/            # Types TypeScript
├── store/               # Configuration Redux
├── style/               # Styles globaux
└── utils/               # Fonctions utilitaires
```

## Fonctionnalités Principales

### Authentification
- Connexion et inscription des utilisateurs
- Gestion des sessions avec tokens JWT
- Modal d'expiration de session
- Authentification persistante

### Gestion des Événements
- Consultation des épreuves olympiques
- Filtrage par discipline et lieu
- Carousel d'affichage des épreuves
- Détails complets des événements

### Système de Billetterie
- Sélection d'offres de billets
- Gestion du panier avec Redux
- Validation des stocks en temps réel
- Interface responsive pour tous les appareils

### Processus d'Achat
- Ajout/suppression d'offres au panier
- Calcul automatique des totaux
- Intégration sécurisée des paiements
- Génération de QR codes pour les billets

## Services API

L'application communique avec plusieurs services backend :

- **DisciplineService** : Gestion des disciplines sportives
- **EpreuveService** : Récupération des épreuves
- **EvenementService** : Détails des événements
- **LieuService** : Informations sur les lieux
- **OffreService** : Gestion des offres de billets
- **PaiementService** : Traitement des paiements
- **TicketService** : Gestion des billets
- **QrCodeService** : Génération des codes QR

## Responsive Design

L'application est entièrement responsive avec :

- **Mobile First** : Optimisée pour les appareils mobiles
- **Breakpoints Adaptatifs** : Utilisation des breakpoints Tailwind
- **Composants Conditionnels** : Headers et layouts spécifiques mobile/desktop
- **Hook useIsMobile** : Détection automatique du type d'appareil

## Hooks Personnalisés

- **useIsMobile** : Détection responsive des écrans
- **useAuth** : Gestion de l'authentification
- **useCart** : Interface avec le store Redux du panier

## Design System

L'application utilise un design system cohérent basé sur :

- **DaisyUI** : Composants UI prêts à l'emploi
- **Tailwind CSS** : Classes utilitaires pour le styling
- **Couleurs Olympiques** : Palette de couleurs thématique
- **Typographie** : Hiérarchie claire et lisible

## États de l'Application

### État Global (Redux)
- **Panier** : Articles sélectionnés et quantités
- **Authentification** : Tokens et informations utilisateur
- **UI** : États de chargement et notifications

### États Locaux
- **Formulaires** : Validation et soumission
- **Modals** : Ouverture/fermeture des dialogues
- **Filtres** : Critères de recherche des événements

## Composants Principaux

### Composants Communs
- **Spinner** : Indicateurs de chargement
- **Notification** : Messages utilisateur
- **Modal** : Dialogues et overlays

### Composants Métier
- **CardEpreuve** : Affichage des épreuves
- **CardOffre** : Sélection des offres
- **CarousselEpreuve** : Navigation des événements
- **QrCodeModal** : Affichage des billets

## Sécurité

- **Validation côté client** : Contrôles de saisie
- **Tokens JWT** : Authentification sécurisée  
- **HTTPS** : Communications chiffrées
- **Sanitisation** : Protection XSS

## Performance

- **Code Splitting** : Chargement optimisé des modules
- **Image Optimization** : Next.js Image component
- **Lazy Loading** : Chargement à la demande
- **Bundle Analysis** : Optimisation de la taille

## Tests

- **Tests Unitaires** : Jest + React Testing Library
- **Tests de Composants** : Rendu et interactions
- **Tests d'Intégration** : Services API

## Comment Utiliser Cette Documentation

Cette documentation est générée automatiquement à partir du code source. Chaque module, composant et service est documenté avec :

- **Description détaillée** : Rôle et responsabilités
- **Props/Paramètres** : Types et utilisation
- **Exemples d'usage** : Cas d'utilisation courants  
- **Notes techniques** : Détails d'implémentation

Naviguez dans les sections pour explorer l'architecture et comprendre le fonctionnement de chaque partie du système.

---

*Cette documentation est maintenue automatiquement. Pour toute question technique, consultez les commentaires dans le code source.*
