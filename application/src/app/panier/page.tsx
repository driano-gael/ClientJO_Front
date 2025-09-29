'use client';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {OffrePanier} from '@/type/achat/offrePanier';
import {Evenement} from '@/type/evenement/evenement';
import {useOffres} from '@/hook/useOffre';
import {EvenementService} from '@/lib/api/service/evenementService';
import {addOneArticleToCart, removeOneArticleFromCart} from '@/lib/reducer/panier/panierSlice';
import Image from 'next/image';
import Header from "@/components/header/Header";

export default function PanierPage() {
  const dispatch = useDispatch();
  const panierItems = useSelector((state: { panier: { items: OffrePanier[] } }) => state.panier.items);
  const {offres} = useOffres();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EvenementService.getAllEvenements().then(data => {
      setEvenements(data);
      setLoading(false);
    });
  }, []);

  // Grouper les items du panier par événement
  const panierParEvenement: Record<number, OffrePanier[]> = {};
  panierItems.forEach(item => {
    if (!panierParEvenement[item.evenementId]) {
      panierParEvenement[item.evenementId] = [];
    }
    panierParEvenement[item.evenementId].push(item);
  });

  if (loading) return <div className="text-black">Chargement du panier...</div>;

  if (panierItems.length === 0) return <div className="text-center text-black mt-10 text-black">Votre panier est
    vide.</div>;

  return (
    <>
      <Header/>

      <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Mon panier</h1>
        {Object.entries(panierParEvenement).map(([evenementId, items]) => {
          const evenement = evenements.find(e => e.id === Number(evenementId));
          // Calcul du nombre de places réservées pour cet événement
          const totalReservedPlaces = items.reduce((acc, item) => {
            const offre = offres.find(o => o.id === item.offreId);
            return acc + (offre ? offre.nb_personne * item.quantity : 0);
          }, 0);
          const remainingTickets = evenement ? evenement.nb_place_restante - totalReservedPlaces : 0;

          return (
            <div key={evenementId} className="mb-8 border-b pb-4">
              <h2 className="text-xl font-semibold mb-2 text-accent text-black">
                {evenement ? evenement.description : `Événement #${evenementId}`}
                {evenement && (
                  <span className="ml-4 text-base font-normal text-black"> : {remainingTickets}</span>
                )}
              </h2>
              <ul>
                {items.map(item => {
                  const offre = offres.find(o => o.id === item.offreId);
                  const montant = offre ? offre.montant * item.quantity : 0;
                  // Vérifier si on peut ajouter une offre (places restantes)
                  const canAdd = offre && remainingTickets >= offre.nb_personne;
                  return (
                    <li key={item.offreId}
                        className="flex items-center justify-between py-2 border-b last:border-b-0 text-black">
                      {/* Ligne horizontale : nom offre, icône -, quantité, icône +, montant, icône poubelle */}
                      <div className="flex items-center gap-3 w-full">
                        {/* Nom de l'offre */}
                        <span
                          className="font-medium text-black min-w-[120px]">{offre ? offre.libelle : `Offre #${item.offreId}`}</span>
                        {/* Icône moins */}
                        <button
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                          onClick={() => dispatch(removeOneArticleFromCart({
                            evenementId: item.evenementId,
                            offreId: item.offreId
                          }))}
                          aria-label="Retirer une offre"
                        >
                          <Image src="/images/minus.png" alt="moins" width={20} height={20}/>
                        </button>
                        {/* Quantité */}
                        <span className="text-lg font-medium text-black min-w-[30px] text-center">{item.quantity}</span>
                        {/* Icône plus */}
                        <button
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                          disabled={!canAdd}
                          onClick={() => dispatch(addOneArticleToCart({
                            evenementId: item.evenementId,
                            offreId: item.offreId
                          }))}
                          aria-label="Ajouter une offre"
                        >
                          <Image src="/images/add.png" alt="plus" width={20} height={20}/>
                        </button>
                        {/* Montant */}
                        <span className="font-bold text-black min-w-[60px] text-right">{montant} €</span>
                        {/* Icône poubelle */}
                        <button
                          className="p-1 rounded hover:bg-red-100"
                          onClick={() => {
                            for (let i = 0; i < item.quantity; i++) {
                              dispatch(removeOneArticleFromCart({
                                evenementId: item.evenementId,
                                offreId: item.offreId
                              }));
                            }
                          }}
                          aria-label="Vider l'offre du panier"
                        >
                          <Image src="/images/delete.png" alt="poubelle" width={20} height={20}/>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
