import {useOffres} from "@/hook/useOffre";
import CardOffre from "@/components/evenements/CardOffre";


type Props = {
  evenementId: number,
  remainingTickets: number;
  onReservePlaces: (evenementId:number, offreId: number) => void;
  onUnReservePlaces: (evenementId:number, offreId: number) => void;
};


export default function DisplayedOffre({evenementId,remainingTickets, onReservePlaces, onUnReservePlaces}: Props) {
  const {offres, loading, error} = useOffres();

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
              onReservePlaces={() => onReservePlaces(evenementId,offre.id)}
              onUnReservePlaces={() => onUnReservePlaces(evenementId,offre.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}