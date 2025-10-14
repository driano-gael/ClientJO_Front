/**
 * @module components/header/HeaderMobile
 * Module de composant HeaderMobile pour la navigation principale sur appareils mobiles
 *
 * Ce module contient le composant HeaderMobile qui fournit la barre de navigation
 * principale optimisée pour les écrans mobiles. Il intègre un menu burger, le logo
 * et le profil utilisateur dans une mise en page compacte adaptée aux petits écrans.
 *
 * ## Fonctionnalités principales
 * - Barre de navigation horizontale optimisée pour mobile
 * - Menu burger avec état d'ouverture/fermeture géré par useState
 * - Logo Paris 2024 avec dimensions réduites pour mobile
 * - Intégration du composant Profile pour gestion utilisateur
 * - Navigation coulissante ou overlay pour économiser l'espace
 * - Design responsive avec breakpoints md:hidden
 *
 * ## Structure de navigation
 * - **Menu burger** : Section gauche avec bouton toggle
 * - **Logo + Titre** : Section centrale avec branding Paris 2024
 * - **Profil** : Section droite avec composant Profile intégré
 *
 * ## Interactions mobiles
 * - Bouton burger avec animation SVG (3 lignes horizontales)
 * - Toggle d'état pour ouverture/fermeture du menu
 * - Focus outline pour accessibilité tactile
 * - Aria-label pour lecteurs d'écran
 * - Touch-friendly avec tailles de boutons adaptées
 *
 * ## Gestion d'état
 * - useState pour isMenuOpen (boolean)
 * - Toggle fonction avec setIsMenuOpen
 * - État réactif pour l'affichage du menu
 * - Fermeture automatique possible lors de navigation
 *
 * ## Design adaptatif
 * - Padding réduit (px-4 py-2) pour économiser l'espace
 * - Logo plus petit (50x55px) par rapport au desktop
 * - Typography responsive avec md:text-xl
 * - Cache le menu burger sur écrans moyens et plus (md:hidden)
 *
 * ## Accessibilité mobile
 * - Aria-label sur le bouton burger
 * - Focus states appropriés pour navigation tactile
 * - Contrast suffisant pour les éléments interactifs
 * - Taille de touch target optimale (w-8 h-8)
 *
 * @group Components
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Profile from './Profile';

/**
 * Composant HeaderMobile pour la navigation principale sur appareils mobiles.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant crée une barre de navigation mobile compacte avec menu burger
 * qui s'adapte automatiquement aux contraintes d'espace des petits écrans.
 * Il gère l'état d'ouverture/fermeture du menu avec animation et fermeture
 * automatique lors de la navigation.
 *
 * @returns Header de navigation mobile avec menu burger et profil utilisateur
 *
 * @example
 * ```tsx
 * // Utilisation dans un layout mobile
 * import HeaderMobile from '@/components/header/HeaderMobile';
 *
 * function MobileLayout({ children }) {
 *   return (
 *     <>
 *       <HeaderMobile />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 *
 * // Dans un composant responsive
 * const isMobile = useIsMobile();
 * return (
 *   <>
 *     {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
 *     {children}
 *   </>
 * );
 *
 * // Avec gestion d'état personnalisée
 * function App() {
 *   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 *
 *   return (
 *     <HeaderMobile
 *       onMenuToggle={setIsMobileMenuOpen}
 *       isOpen={isMobileMenuOpen}
 *     />
 *   );
 * }
 * ```
 */
export default function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-base-100 relative">
      <nav className="flex items-center justify-between px-4 py-2">

        {/* Menu burger pour mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle navigation"
          >
            {/* Icône burger */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div style={{ position: 'relative', width: '50px', height: '55px' }}>
            <Image
              src="/images/logofullrect.png"
              alt="Logo JO"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className="text-black md:text-xl">Paris 2024 Tickets</span>
        </div>

        {/* Icône de connexion */}
        <Profile />
      </nav>

      {/* Menu déroulant pour mobile */}
      {isMenuOpen && (
        <div className="md:hidden border border-black/20 bg-base-100 px-4 pb-4 animate-slide-down">
          <ul className="flex flex-col text-black gap-4 mt-2 text-lg font-semibold">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            </li>
            <li>
              <Link href="/evenements" onClick={() => setIsMenuOpen(false)}>Evenements</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
