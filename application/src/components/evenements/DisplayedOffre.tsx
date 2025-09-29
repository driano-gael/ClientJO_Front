import {useOffres} from "@/hook/useOffre";
import CardOffre from "@/components/evenements/CardOffre";
import { useSelector } from "react-redux";
import { OffrePanier } from "@/type/achat/offrePanier";


type Props = {
  evenementId: number,
  remainingTickets: number;
  onReservePlaces: (evenementId:number, offreId: number) => void;
  onUnReservePlaces: (evenementId:number, offreId: number) => void;
};


export default function DisplayedOffre({evenementId,remainingTickets, onReservePlaces, onUnReservePlaces}: Props) {
  const {offres, loading, error} = useOffres();
  // Sélectionner le panier depuis Redux
  const panierItems = useSelector((state: { panier: { items: OffrePanier[] } }) => state.panier.items);

  return (
    <>
      {loading && <p>Chargement des offres...</p>}
      {error && <p>Erreur lors du chargement des offres : {error.message}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offres.map((offre) => {
            // Chercher la quantité pour cette offre et cet événement
            const item = panierItems.find((i: OffrePanier) => i.evenementId === evenementId && i.offreId === offre.id);
            const quantityInCart = item ? item.quantity : 0;
            return (
              <CardOffre
                key={offre.id}
                offre={offre}
                remainingTickets={remainingTickets}
                onReservePlaces={() => onReservePlaces(evenementId,offre.id)}
                onUnReservePlaces={() => onUnReservePlaces(evenementId,offre.id)}
                quantityInCart={quantityInCart}
              />
            );
          })}
        </div>
      )}
    </>
  );
}