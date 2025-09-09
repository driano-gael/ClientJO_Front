import { useMemo } from "react";
import {Epreuve, EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";
import {filterEpreuves} from "@/lib/filter/epreuveFilter";

export function useFilteredEpreuves(
  epreuveCards: EpreuveCardType[],
  filters: EpreuveFilters,
  fullEpreuves?: Epreuve[]
) {
  return useMemo(() => filterEpreuves(epreuveCards, filters, fullEpreuves), [epreuveCards, filters, fullEpreuves]);
}