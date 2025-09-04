import useIsMobile from "@/hook/useIsMobile";
import SearchEpreuveMobile from "@/components/evenements/SearchEpreuveMobile";
import SearchEpreuveDesktop from "@/components/evenements/SearchEpreuveDesktop";
import {EpreuveFilters, Epreuve} from "@/type/evenement/epreuve";

interface SearchEpreuveProps {
  onFiltersChange: (filters: EpreuveFilters) => void;
  filters: EpreuveFilters;
  epreuves: Epreuve[];
}

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