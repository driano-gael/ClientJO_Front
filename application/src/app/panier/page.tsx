'use client';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {OffrePanier} from '@/type/achat/offrePanier';
import {Evenement} from '@/type/evenement/evenement';
import {useOffres} from '@/hook/useOffre';
import {EvenementService} from '@/lib/api/service/evenementService';
import {addOneArticleToCart, clearCart, removeOneArticleFromCart} from '@/lib/reducer/panier/panierSlice';
import Image from 'next/image';
import Header from "@/components/header/Header";
import {PaiementService} from "@/lib/api/service/paiementService";
import {useRouter} from 'next/navigation';
import Notification from "@/components/common/Notification";
import Spinner from "@/components/common/Spinner";
import {NotificationProps} from "@/type/common/notification";

export default function PanierPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const panierItems = useSelector((state: { panier: { items: OffrePanier[] } }) => state.panier.items);
  const {offres} = useOffres();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationProps | null>();
  const [showNotification, setShowNotification] = useState(false);

  const handleCloseNotification = useCallback(() => {
    requestAnimationFrame(() => {
      setShowNotification(false);
      setNotification(null);
    });
  }, []);

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

  // Calcul du total du panier
  const totalPanier = panierItems.reduce((acc, item) => {
    const offre = offres.find(o => o.id === item.offreId);
    return acc + (offre ? offre.montant * item.quantity : 0);
  }, 0);

  const handleClickDash = (item: OffrePanier) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer toute cette offre du panier ?");
    if (!confirmed) return;

    for (let i = 0; i < item.quantity; i++) {
      dispatch(removeOneArticleFromCart({
        evenementId: item.evenementId,
        offreId: item.offreId
      }));
    }
  };
  const handleValidCart = useCallback(async (_force_failed: boolean = false) => {
    try {
      const reponse = await PaiementService.checkPaiement({
        amount: totalPanier,
        force_failed: _force_failed,
        items: panierItems
      });

      const status = reponse.gateway_response.status;

      switch (status) {
        case "requires_confirmation":
          setNotification({
            message: "Paiement autorisé, en attente de confirmation.",
            type: "info"
          })
          setShowNotification(true);
          break;

        case "succeeded":
          dispatch(clearCart());
          setNotification({
            message: "Paiement validé ! Redirection en cours...",
            type: "success"
          })
          setShowNotification(true);
          setTimeout(() => {
            router.push('/billets');
          }, 1000);
          break;

        case "failed":
          setNotification({
            message: "Le paiement a échoué. Veuillez réessayer.",
            type: "error"
          })
          setShowNotification(true);
          break;

        case "refunded":
          setNotification({
            message: "Paiement remboursé. Contactez le support.",
            type: "info"
          })
          setShowNotification(true);
          break;

        default:
          setNotification({
            message: "Statut de paiement inconnu.",
            type: "error"
          })
          setShowNotification(true);
      }
    } catch (err) {
      setNotification({
        message: "Une erreur inattendue est survenue.",
        type: "error"
      })
      console.error("Erreur inattendue lors du paiement", err);
      setShowNotification(true);
    }
  }, [dispatch, panierItems, totalPanier, router]);


  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <Spinner/>
      <span>Chargement du panier...</span>
    </div>)


  return (
    <>
      <Header/>

      {showNotification && notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === 'success' ? 1000 : 3000}
          onCloseAction={handleCloseNotification}
        />
      )}

      <div className="w-screen min-h-screen bg-base-100 flex flex-col items-center justify-start p-0 m-0">
        <div className="w-full max-w-2xl mt-8 p-4 bg-white rounded-xl shadow-lg border border-accent">
          <h1 className="text-2xl font-bold mb-6 text-center text-accent">Mon panier</h1>
          {Object.entries(panierParEvenement).length === 0 ? (
            <div className="text-center text-black mt-10">Votre panier est vide.</div>
          ) : (
            <>
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
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-accent flex flex-wrap items-center gap-2">
                      <span>{evenement ? evenement.description : `Événement #${evenementId}`}</span>
                      {evenement && (
                        <span
                          className="ml-2 text-sm md:text-base font-normal text-black bg-base-200 rounded px-2 py-1">Places restantes : {remainingTickets}</span>
                      )}
                    </h2>
                    <ul className="divide-y divide-base-200">
                      {items.map(item => {
                        const offre = offres.find(o => o.id === item.offreId);
                        const montant = offre ? offre.montant * item.quantity : 0;
                        const canAdd = offre && remainingTickets >= offre.nb_personne;
                        return (
                          <li key={item.offreId}
                              className="flex flex-wrap md:flex-nowrap items-center justify-between py-2 text-black gap-2 md:gap-4">
                                                        <span
                                                          className="font-medium text-black min-w-[100px] md:min-w-[140px] truncate">{offre ? offre.libelle : `Offre #${item.offreId}`}</span>
                            <div className="flex items-center gap-1 md:gap-2">
                              <button
                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 border border-base-200"
                                onClick={() => dispatch(removeOneArticleFromCart({
                                  evenementId: item.evenementId,
                                  offreId: item.offreId
                                }))}
                                aria-label="Retirer une offre"
                              >
                                <Image src="/images/minus.png" alt="moins" width={20}
                                       height={20}/>
                              </button>
                              <span
                                className="text-lg font-medium text-black min-w-[30px] text-center">{item.quantity}</span>
                              <button
                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 border border-base-200"
                                disabled={!canAdd}
                                onClick={() => dispatch(addOneArticleToCart({
                                  evenementId: item.evenementId,
                                  offreId: item.offreId
                                }))}
                                aria-label="Ajouter une offre"
                              >
                                <Image src="/images/add.png" alt="plus" width={20}
                                       height={20}/>
                              </button>
                            </div>
                            <span
                              className="font-bold text-black min-w-[60px] text-right">{montant} €</span>
                            <button
                              className="p-1 rounded hover:bg-red-100 border border-base-200"
                              onClick={()=>handleClickDash(item)}
                              aria-label="Vider l'offre du panier"
                            >
                              <Image src="/images/delete.png" alt="poubelle" width={20}
                                     height={20}/>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              {/* Total panier et bouton valider */}
              <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
                <div className="text-xl font-bold text-black">Total : <span
                  className="text-accent">{totalPanier} €</span></div>
                <button
                  className="bg-accent text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-accent/90 transition text-lg w-full md:w-auto"
                  onClick={() => handleValidCart()}
                  disabled={totalPanier === 0}
                >
                  Valider le panier
                </button>
                <button
                  className="bg-error text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-accent/90 transition text-lg w-full md:w-auto"
                  onClick={() => handleValidCart(true)}
                  disabled={totalPanier === 0}
                >
                  achat en echec
                </button>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}
