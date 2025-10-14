/**
 * @module components/header/HeaderDesktop
 * Module de composant HeaderDesktop pour la navigation principale sur ordinateurs de bureau
 *
 * Ce module contient le composant HeaderDesktop qui fournit la barre de navigation
 * principale optimisée pour les écrans de bureau. Il intègre le logo, la navigation
 * entre les pages principales et le profil utilisateur dans une mise en page horizontale.
 *
 * ## Fonctionnalités principales
 * - Barre de navigation horizontale optimisée pour desktop
 * - Logo Paris 2024 avec dimensions fixes et priority loading
 * - Navigation principale entre Accueil et Événements
 * - Intégration du composant Profile pour gestion utilisateur
 * - Design avec séparateurs visuels et hover effects
 * - Layout responsive avec flexbox pour distribution équilibrée
 *
 * ## Structure de navigation
 * - **Logo + Titre** : Section gauche avec branding Paris 2024
 * - **Navigation centrale** : Liens principaux avec séparateur visuel
 * - **Profil** : Section droite avec composant Profile intégré
 *
 * ## Design et interactions
 * - Border arrondi avec overflow hidden pour la navigation
 * - Hover effects avec transition couleur (300ms)
 * - Séparateur vertical entre les liens de navigation
 * - Couleur de survol harmonisée (#ffe0b3)
 * - Typography bold pour les éléments de navigation
 *
 * ## Intégration
 * - Utilisé dans le système de header responsive
 * - Compatible avec Next.js Link pour navigation SPA
 * - Intégré avec le composant Profile pour authentification
 * - Optimisé pour écrans larges (desktop/tablette)
 *
 * ## Accessibilité
 * - Alt text approprié pour les images
 * - Structure sémantique avec header et nav
 * - Focus states avec hover effects
 * - Navigation keyboard-friendly
 *
 * @group Components
 */

import Link from 'next/link';
import Image from 'next/image';
import Profile from './Profile';

/**
 * Composant HeaderDesktop pour la navigation principale sur ordinateurs de bureau.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant crée une barre de navigation horizontale optimisée pour les écrans larges
 * avec une structure en trois sections : branding à gauche, navigation au centre,
 * et profil utilisateur à droite. Il utilise Next.js pour la navigation côté client.
 *
 * @returns Header de navigation desktop avec logo, liens principaux et profil utilisateur
 *
 * @example
 * ```tsx
 * // Utilisation dans un layout desktop
 * import HeaderDesktop from '@/components/header/HeaderDesktop';
 *
 * function DesktopLayout({ children }) {
 *   return (
 *     <>
 *       <HeaderDesktop />
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
 * ```
 */
export default function HeaderDesktop() {
  return (
    <header className="bg-base-100">
      <nav className="bg-base-100 text-black mx-auto flex justify-between px-[40px] py-[10px]">
        <div className="flex flex-1 items-center gap-2">
          <div style={{ position: 'relative', width: '65px', height: '70px' }}>
            <Image
              src="/images/logofullrect.png"
              alt="Logo JO"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className='font-bold'>Paris 2024 Tickets</span>
        </div>

<div className="mx-auto inline-flex items-stretch border border-black rounded-full overflow-hidden">
  <Link
    href="/"
    className="flex-1 flex items-center justify-center text-center font-bold text-xl pr-5 pl-10 py-2 hover:bg-[#ffe0b3] transition-colors duration-300"
  >
    Accueil
  </Link>

  <span className="w-[1px] h-[75%] bg-black self-center" />

  <Link
    href="/evenements"
    className="flex-1 flex items-center justify-center text-center font-bold text-xl pr-10 pl-5 py-2 whitespace-nowrap hover:bg-[#ffe0b3] transition-colors duration-300"
  >
    Les évènements
  </Link>
</div>



        <Profile />
      </nav>
    </header>
  );
}