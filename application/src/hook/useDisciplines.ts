import { useState, useEffect } from "react";
import { Discipline } from "@/type/evenement/discipline";
import { DisciplineService, DisciplineFilters } from "@/lib/api/service/disciplineService";

/**
 * @group Hooks
 */

/**
 * Hook personnalisé pour récupérer la liste des disciplines avec gestion d'état
 * @param filters - Filtres optionnels pour la recherche et pagination
 * @returns Objet contenant les disciplines, l'état de chargement et les erreurs
 * @example
 * const { disciplines, loading, error } = useDisciplines();
 * const { disciplines: filteredDisciplines } = useDisciplines({ nom: 'Athlétisme' });
 */
export function useDisciplines(filters?: DisciplineFilters) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    DisciplineService.getAllDisciplines(filters)
      .then(setDisciplines)
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [filters]);

  return { disciplines, loading, error };
}
