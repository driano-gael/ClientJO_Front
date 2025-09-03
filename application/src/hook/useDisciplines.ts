import { useState, useEffect } from "react";
import { Discipline } from "@/type/evenement/discipline";
import { DisciplineService, DisciplineFilters } from "@/lib/api/service/disciplineService";

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

