import {useState, useEffect} from "react";
import {Offre} from "@/type/achat/offre";
import { OffreService } from "@/lib/api/service/offreService";


/**
 * Hook personnalisé pour récupérer les offres
 */
export function useOffres() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOffres = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await OffreService.getAllOffre();
        setOffres(data);
      } catch (err) {
        setError(err as Error);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  return { offres, loading, error };
}

