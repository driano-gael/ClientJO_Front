import { useEffect, useState } from 'react';

/**
 * @group Hooks
 */

/**
 * Hook personnalisé pour détecter si l'utilisateur est sur un appareil mobile
 * @returns {boolean} true si l'écran fait moins de 768px de large, false sinon
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Afficher la version mobile
 * }
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMatch = () => setIsMobile(mediaQuery.matches);

    updateMatch()

    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  return isMobile;
}