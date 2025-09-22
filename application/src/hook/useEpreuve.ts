import {useState, useEffect, useCallback} from "react";
import {Epreuve, EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";
import { EpreuveService } from "@/lib/api/service/epreuveService";
import {Evenement} from "@/type/evenement/evenement";
import {EvenementService} from "@/lib/api/service/evenementService";



/**
 * Hook personnalisé pour récupérer les épreuves en tant que cartes
 * @param initialFilters Optionnel : filtres à passer au service
 */
export function useEpreuvesCards(initialFilters?: EpreuveFilters) {
  const [epreuves, setEpreuves] = useState<EpreuveCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEpreuves = useCallback(async (filters?: EpreuveFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await EpreuveService.getAllEvenementsAsCards(filters);
      setEpreuves(data);
    } catch (err) {
      console.error("Erreur récupération des épreuves :", err);
      setError(err as Error);
      setEpreuves([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEpreuves(initialFilters);
  }, [fetchEpreuves, initialFilters]);

  return { epreuves, loading, error, fetchEpreuves };
}

export function useEpreuves(initialFilters?: EpreuveFilters) {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEpreuves = useCallback(async (filters?: EpreuveFilters) => {
  setLoading(true);
  setError(null);
  try {
    const data = await EpreuveService.getAllEpreuves(filters);
    setEpreuves(data);
  } catch (err) {
    console.error("Erreur récupération des épreuves :", err);
    setError(err as Error);
    setEpreuves([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchEpreuves(initialFilters);
  }, [fetchEpreuves, initialFilters]);

  return { epreuves, loading, error, fetchEpreuves };
}

export function useEvenementByEpreuveId(id: number) {
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvenement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EvenementService.getEvenementByEpreuveId(id);
      setEvenement(data);
    } catch (err) {
      console.error("Erreur récupération de l'événement :", err);
      setError(err as Error);
      setEvenement(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEvenement();
    }
  }, []);

  return { evenement, loading, error, refetch: fetchEvenement };
}