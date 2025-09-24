import {useOffres} from "@/hook/useOffre";
import {useEffect} from "react";
import CardOffre from "@/components/evenements/CardOffre";
import {Offre} from "@/type/achat/offre";


type Props = {
  offres: Offre[];
  remainingTickets: number;
  onReservePlaces: (offreId: number) => void;
  onUnReservePlaces: (offreId: number) => void;
};


export default function DisplayedOffre({remainingTickets, onReservePlaces, onUnReservePlaces}: Props) {
  const {offres, loading, error} = useOffres();

  useEffect(() => {
    console.log("CardOffre monté");
    console.log("CardOffre: useOffres retour", {offres, loading, error});
  }, [offres, loading, error]);

  return (
    <>
      {loading && <p>Chargement des offres...</p>}
      {error && <p>Erreur lors du chargement des offres : {error.message}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offres.map((offre) => (
            <CardOffre
              key={offre.id}
              offre={offre}
              remainingTickets={remainingTickets}
              onReservePlaces={() => onReservePlaces(offre.id)}
              onUnReservePlaces={() => onUnReservePlaces(offre.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}