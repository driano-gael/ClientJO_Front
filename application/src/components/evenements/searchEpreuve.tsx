/**
 * @module components/evenements/SearchEpreuve
 * Module de composant SearchEpreuve pour la recherche et le filtrage des épreuves olympiques
 *
 * Ce module contient le composant SearchEpreuve qui gère l'affichage adaptatif
 * des interfaces de recherche selon le type d'appareil (mobile ou desktop).
 * Il sert de composant wrapper intelligent qui détermine automatiquement
 * quelle interface de recherche utiliser.
 *
 * ## Fonctionnalités principales
 * - Détection automatique du type d'appareil (mobile/desktop)
 * - Rendu conditionnel de l'interface appropriée
 * - Transmission des filtres et callbacks aux composants enfants
 * - Interface unified pour les différentes plateformes
 * - Gestion centralisée des filtres de recherche
 *
 * ## Composants intégrés
 * - **SearchEpreuveMobile** : Interface optimisée pour appareils mobiles
 * - **SearchEpreuveDesktop** : Interface optimisée pour ordinateurs de bureau
 * - **useIsMobile** : Hook de détection du type d'appareil
 *
 * ## Gestion des filtres
 * - Transmission bidirectionnelle des filtres actuels
 * - Callback unifié pour les changements de filtres
 * - Synchronisation automatique entre les interfaces
 * - Support complet des types EpreuveFilters
 *
 * ## Responsive Design
 * - Détection automatique de la taille d'écran
 * - Basculement dynamique entre les interfaces
 * - Optimisation UX pour chaque plateforme
 * - Consistance des fonctionnalités entre versions
 *
 * ## Intégration
 * - Utilisé dans les pages de liste d'épreuves
 * - Compatible avec tous les systèmes de filtrage
 * - Intégré avec les hooks de recherche
 *
 * @group Components
 */

import useIsMobile from "@/hook/useIsMobile";
import SearchEpreuveMobile from "@/components/evenements/SearchEpreuveMobile";
import SearchEpreuveDesktop from "@/components/evenements/SearchEpreuveDesktop";
import {EpreuveFilters, Epreuve} from "@/type/evenement/epreuve";

/**
 * Props du composant SearchEpreuve
 */
interface SearchEpreuveProps {
  /** Fonction appelée lors des changements de filtres de recherche */
  onFiltersChange: (filters: EpreuveFilters) => void;
  /** État actuel des filtres de recherche */
  filters: EpreuveFilters;
  /** Liste des épreuves disponibles pour le filtrage et l'affichage */
  epreuves: Epreuve[];
}

/**
 * Composant SearchEpreuve pour la recherche et le filtrage adaptatif des épreuves.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant détermine automatiquement quelle interface de recherche afficher
 * selon le type d'appareil détecté, offrant une expérience utilisateur optimisée
 * pour chaque plateforme tout en maintenant la consistance fonctionnelle.
 *
 * @param props - Les propriétés du composant
 * @param props.onFiltersChange - Callback pour les changements de filtres
 * @param props.filters - État actuel des filtres
 * @param props.epreuves - Liste des épreuves pour le contexte de recherche
 *
 * @returns Interface de recherche adaptée au type d'appareil détecté
 *
 * @example
 * ```tsx
 * // Utilisation avec état de filtres
 * const [filters, setFilters] = useState<EpreuveFilters>({
 *   discipline: '',
 *   date: '',
 *   genre: '',
 *   lieu: ''
 * });
 *
 * <SearchEpreuve
 *   onFiltersChange={setFilters}
 *   filters={filters}
 *   epreuves={epreuvesData}
 * />
 *
 * // Avec gestion avancée des filtres
 * const handleFiltersChange = useCallback((newFilters: EpreuveFilters) => {
 *   setFilters(newFilters);
 *   // Logique de filtrage additionnelle
 *   applyFiltersToResults(newFilters);
 * }, []);
 * ```
 */
export default function SearchEpreuve({ onFiltersChange, filters, epreuves }: SearchEpreuveProps){
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <SearchEpreuveMobile
        onFiltersChange={onFiltersChange}
        filters={filters}
        epreuves={epreuves} // ← Transmettre aux composants enfants
      />
    )
  }else{
    return (
     <SearchEpreuveDesktop
       onFiltersChange={onFiltersChange}
       filters={filters}
       epreuves={epreuves} // ← Ajouter les épreuves pour desktop aussi
     />
    )
  }
}