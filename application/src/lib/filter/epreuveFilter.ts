import {Epreuve, EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";

export function filterEpreuves(
  epreuves: EpreuveCardType[],
  filters: EpreuveFilters,
  fullEpreuves?: Epreuve[] // ton tableau complet avec discipline.id
): EpreuveCardType[] {
  let filtered = [...epreuves];

  if (filters.libelle) {
    filtered = filtered.filter(epreuve =>
      epreuve.libelle.toLowerCase().includes(filters.libelle!.toLowerCase()) ||
      epreuve.discipline.toLowerCase().includes(filters.libelle!.toLowerCase())
    );
  }

  if (filters.disciplineId) {
    filtered = filtered.filter(epreuve => {
      const epreuveComplete = fullEpreuves?.find(e =>
        e.libelle === epreuve.libelle &&
        e.discipline.nom === epreuve.discipline
      );
      return epreuveComplete ? epreuveComplete.discipline.id === filters.disciplineId : false;
    });
  }

  if (filters.date) {
    filtered = filtered.filter(epreuve => {
      if (!epreuve.dateRaw) return false;
      const epreuveDate = new Date(epreuve.dateRaw);
      const filterDate = new Date(filters.date!);

      const epreuveDateOnly = new Date(epreuveDate.getFullYear(), epreuveDate.getMonth(), epreuveDate.getDate());
      const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());

      return epreuveDateOnly >= filterDateOnly;
    });
  }

  if (filters.tour) {
    filtered = filtered.filter(epreuve => epreuve.tour === filters.tour);
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.dateRaw).getTime() - new Date(b.dateRaw).getTime();
      } else if (filters.sortBy === 'libelle') {
        comparison = a.libelle.localeCompare(b.libelle);
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
}