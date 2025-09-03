'use client';
import { useState, useMemo } from 'react';
import Header from "@/components/header/Header";
import CarousselEpreuve from "@/components/evenements/CarousselEpreuve";
import SearchEpreuve from "@/components/evenements/searchEpreuve";
import DisplayedEpreuves from "@/components/evenements/DisplayedEpreuves";
import {useEpreuves} from "@/hook/useEpreuve";
import Spinner from "@/components/common/Spinner";
import Notification from "@/components/common/Notification";
import {EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";
import {mapEpreuveToCard} from "@/lib/api/service/epreuveService";


export default function Evenements() {
  const {epreuves, loading, error} = useEpreuves()
  const [filters, setFilters] = useState<EpreuveFilters>({});

  const epreuveCards: EpreuveCardType[] = epreuves.map(mapEpreuveToCard);

  // Fonction de filtrage des épreuves
  const filteredEpreuveCards = useMemo(() => {
    let filtered = [...epreuveCards];

    // Filtre par libellé (recherche textuelle)
    if (filters.libelle) {
      filtered = filtered.filter(epreuve =>
        epreuve.libelle.toLowerCase().includes(filters.libelle!.toLowerCase()) ||
        epreuve.discipline.toLowerCase().includes(filters.libelle!.toLowerCase())
      );
    }

    // Filtre par discipline ID
    if (filters.disciplineId) {
      filtered = filtered.filter(epreuve => {
        // Trouver l'épreuve complète correspondante pour accéder à discipline.id
        const epreuveComplete = epreuves.find(e =>
          e.libelle === epreuve.libelle &&
          e.discipline.nom === epreuve.discipline
        );
        return epreuveComplete ? epreuveComplete.discipline.id === filters.disciplineId : false;
      });
    }

    // Filtre par date minimum (toutes les épreuves à partir de cette date)
    if (filters.date) {
      filtered = filtered.filter(epreuve =>
        new Date(epreuve.date).getTime() >= new Date(filters.date!).getTime()
      );
    }

    // Filtre par tour (gardé pour la compatibilité desktop)
    if (filters.tour) {
      filtered = filtered.filter(epreuve =>
        epreuve.tour === filters.tour
      );
    }

    // Tri (gardé pour la compatibilité desktop)
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (filters.sortBy === 'libelle') {
          comparison = a.libelle.localeCompare(b.libelle);
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [epreuveCards, filters, epreuves]);

  // Tri des 10 prochaines épreuves par date la plus récente
  const epreuvesCarrousel = [...epreuveCards]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Fonction pour mettre à jour les filtres
  const handleFiltersChange = (newFilters: EpreuveFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header/>
      <div className="bg-base-200">
        <div className="w-[90%] mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center text-black min-h-[300px]">
              <Spinner size={"large"}/>
              <p>Chargement des évènements...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Notification message={error.message} type={"error"}/>
            </div>
          )}
          <div className="pt-4 pb-4">
            <SearchEpreuve
              onFiltersChange={handleFiltersChange}
              filters={filters}
              epreuves={epreuves} // ← Passer les épreuves en props
            />
          </div>

          <div>
            <p className="font-extrabold text-black">A VENIR</p>
            <hr className="border-1 border-black"/>
            <div className="my-1">
              <CarousselEpreuve epreuves={epreuvesCarrousel}/>
            </div>
          </div>

          <div>
            <p className="font-extrabold text-black">TOUT LES EVENEMENTS</p>
            <hr className="border-1 border-black"/>
            <DisplayedEpreuves epreuves={filteredEpreuveCards}/>
          </div>
        </div>
      </div>
    </>
  );
}