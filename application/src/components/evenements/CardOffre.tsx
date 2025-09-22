import { useOffres } from "@/hook/useOffre";
import { useEffect } from "react";

export default function CardOffre() {
  const { offres, loading, error } = useOffres();

  useEffect(() => {
    console.log("CardOffre monté");
    console.log("CardOffre: useOffres retour", { offres, loading, error });
  }, [offres, loading, error]);

  return (
    <>
      {loading && <p>Chargement des offres...</p>}
      {error && <p>Erreur lors du chargement des offres : {error.message}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offres.map((offre) => (
            <div
              key={offre.id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{offre.libelle}</h3>
              <p className="mb-2">{offre.description}</p>
              <p className="text-lg font-semibold">Prix : {offre.montant} €</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}