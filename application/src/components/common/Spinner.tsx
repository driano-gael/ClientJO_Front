/**
 * @module components/common/Spinner
 * Module de composant Spinner pour l'affichage des indicateurs de chargement
 *
 * Ce module contient le composant Spinner qui affiche un indicateur de chargement rotatif
 * personnalisable. Il est utilisé dans toute l'application pour indiquer les états de
 * chargement lors des appels API ou des opérations asynchrones.
 *
 * ## Fonctionnalités principales
 * - Indicateur de chargement rotatif avec animation CSS
 * - Personnalisation de la taille (small, medium, large)
 * - Personnalisation de la couleur (blue, white, gray)
 * - Classes CSS additionnelles via className
 * - Accessibilité avec attributs ARIA appropriés
 *
 * ## Variantes disponibles
 * ### Tailles
 * - **small** : 16x16px (w-4 h-4)
 * - **medium** : 24x24px (w-6 h-6) - par défaut
 * - **large** : 32x32px (w-8 h-8)
 *
 * ### Couleurs
 * - **blue** : couleur principale de l'application - par défaut
 * - **white** : pour les fonds sombres
 * - **gray** : couleur neutre
 *
 * ## Utilisation courante
 * - Chargement de données depuis l'API
 * - États de transition dans les modals
 * - Indicateurs de soumission de formulaires
 *
 * @module components/common/Spinner
 * @group Components
 */

'use client';

/**
 * Props du composant Spinner
 */
export type SpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

/**
 * Composant Spinner pour afficher un indicateur de chargement.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @param props - Les propriétés du composant
 * @returns Indicateur de chargement rotatif personnalisable
 */
export default function Spinner({ size = 'medium', color = 'blue', className = '' }: SpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-6 h-6';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-600 border-t-transparent';
      case 'white':
        return 'border-white border-t-transparent';
      case 'gray':
        return 'border-gray-600 border-t-transparent';
      default:
        return 'border-blue-600 border-t-transparent';
    }
  };

  return (
    <div 
      className={`${getSizeClasses()} border-2 border-solid ${getColorClasses()} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Chargement en cours"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
}
