/**
 * Hook personnalisé pour la gestion des réservations d'offres dans le panier Redux
 *
 * Ce module contient le hook useReservationOffer qui fournit une interface simple
 * pour gérer les réservations d'offres de billets dans le panier. Il encapsule
 * la logique Redux et offre des fonctions pratiques pour l'ajout/suppression.
 *
 * ## Fonctionnalités principales
 * - Interface simplifiée pour les actions Redux du panier
 * - Accès en lecture aux offres réservées
 * - Fonctions d'ajout et de suppression d'offres
 * - Intégration transparente avec le store Redux
 * - Typage TypeScript complet
 *
 * ## Actions disponibles
 * - **reservePlaces** : Ajoute une offre au panier
 * - **unReservePlaces** : Retire une offre du panier
 * - **reservedOffers** : Liste des offres actuellement dans le panier
 *
 * ## Intégration Redux
 * - Utilise useAppDispatch pour les actions
 * - Utilise useAppSelector pour l'état du panier
 * - Actions synchronisées avec panierSlice
 * - Persistance automatique en localStorage
 *
 * ## Utilisation typique
 * - Intégré dans les composants CardOffre
 * - Utilisé dans les modals de réservation
 * - Synchronisation avec l'affichage du compteur panier
 *
 * @module hook/useReservationOffer
 * @group Hooks
 */

import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {addOneArticleToCart, removeOneArticleFromCart} from "@/lib/reducer/panier/panierSlice";

/**
 * Hook personnalisé pour gérer les réservations d'offres dans le panier.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @returns Objet contenant les offres réservées et les fonctions de gestion
 * @example
 * const { reservedOffers, reservePlaces, unReservePlaces } = useReservationOffer();
 *
 * // Ajouter une offre au panier
 * reservePlaces(1, 2);
 *
 * // Retirer une offre du panier
 * unReservePlaces(1, 2);
 */
export function useReservationOffer() {
  const dispatch = useAppDispatch();
  const reservedOffers = useAppSelector(state => state.panier.items);

  /**
   * Ajoute une offre au panier (réserve une place)
   * @param evenementId - ID de l'événement
   * @param offreId - ID de l'offre à réserver
   */
  const reservePlaces = (evenementId: number, offreId: number) => {
    dispatch(addOneArticleToCart({ evenementId: evenementId, offreId: offreId }));
  };

  /**
   * Retire une offre du panier (annule une réservation)
   * @param evenementId - ID de l'événement
   * @param offreId - ID de l'offre à retirer
   */
  const unReservePlaces = (evenementId: number, offreId: number) => {
    dispatch(removeOneArticleFromCart({ evenementId: evenementId, offreId: offreId }));
  };

  return { reservedOffers, reservePlaces, unReservePlaces };
}
