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
    console.log("useEffect déclenché dans useOffres");
    const fetchOffres = async () => {
      console.log("Début de fetchOffres");
      setLoading(true);
      setError(null);
      try {
        console.log("Appel OffreService.getAllOffre()");
        const data = await OffreService.getAllOffre();
        console.log("Données reçues par getAllOffre:", data);
        setOffres(data);
      } catch (err) {
        console.error("Erreur récupération des offres :", err);
        setError(err as Error);
        setOffres([]);
      } finally {
        console.log("Fin de fetchOffres, loading à false");
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  console.log("Rendu du hook useOffres", { offres, loading, error });
  return { offres, loading, error };
}