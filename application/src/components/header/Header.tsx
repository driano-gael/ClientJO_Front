/**
 * @module components/header/Header
 * Module de composant Header principal pour la navigation de l'application
 *
 * Ce module contient le composant Header qui gère l'affichage adaptatif de l'en-tête de
 * l'application des Jeux Olympiques. Il utilise le hook useIsMobile pour détecter
 * automatiquement le type d'appareil et afficher la version appropriée.
 *
 * ## Fonctionnalités principales
 * - Affichage adaptatif mobile/desktop automatique
 * - Position sticky pour rester visible lors du scroll
 * - Ombre portée pour la séparation visuelle
 * - Z-index élevé pour rester au-dessus du contenu
 * - Support de l'auto-scroll avec scrollMarginTop
 *
 * ## Responsivité
 * - **Mobile** : Affiche HeaderMobile (écrans < 768px)
 * - **Desktop** : Affiche HeaderDesktop (écrans ≥ 768px)
 * - Détection automatique via useIsMobile hook
 * - Transition fluide entre les versions
 *
 * ## Positionnement
 * - Position sticky en haut de la page
 * - Fond base-100 (couleur de base de l'application)
 * - Ombre portée subtile (shadow-[0_3px_12px_rgba(0,0,0,0.25)])
 * - Z-index 50 pour superposition
 *
 * ## Intégration
 * - Utilisé dans le layout principal de l'application
 * - Dépendance sur HeaderMobile et HeaderDesktop
 * - Utilise le hook useIsMobile pour la détection d'écran
 *
 * @module components/header/Header
 * @group Components
 */

'use client';
import HeaderMobile from '@/components/header/HeaderMobile';
import useIsMobile from '@/hook/useIsMobile';
import HeaderDesktop from './HeaderDesktop';

/**
 * Composant Header principal qui affiche la version mobile ou desktop selon la taille d'écran.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @returns Header adaptatif (mobile ou desktop) avec position sticky
 */
export default function Header() {
  const isMobile = useIsMobile();

  return (
    <div
      className="sticky top-0 bg-base-100 shadow-[0_3px_12px_rgba(0,0,0,0.25)] z-50"
      style={{ scrollMarginTop: '0px' }} // Permet l'auto-scroll
    >
      {isMobile ? <HeaderMobile/> : <HeaderDesktop/>}
    </div>
  );
}