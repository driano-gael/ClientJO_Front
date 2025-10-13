import { useMemo } from "react";
import {Epreuve, EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";
import {filterEpreuves} from "@/lib/filter/epreuveFilter";

/**
 * Hook personnalisé pour filtrer des épreuves avec mémorisation
 * Utilise useMemo pour optimiser les performances en évitant le recalcul inutile
 * @param epreuveCards - Liste des épreuves au format carte à filtrer
 * @param filters - Critères de filtrage à appliquer
 * @param fullEpreuves - Liste complète des épreuves (optionnel, nécessaire pour certains filtres)
 * @returns Liste filtrée des épreuves mémorisée
 * @example
 * const filteredEpreuves = useFilteredEpreuves(epreuves, {
 *   libelle: 'natation',
 *   date: '2024-07-26'
 * });
 */
export function useFilteredEpreuves(
  epreuveCards: EpreuveCardType[],
  filters: EpreuveFilters,
  fullEpreuves?: Epreuve[]
) {
  return useMemo(() => filterEpreuves(epreuveCards, filters, fullEpreuves), [epreuveCards, filters, fullEpreuves]);
}