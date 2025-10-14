/**
 * @module components/evenements/DisplayedOffre
 * Module de composant DisplayedOffre pour l'affichage et la gestion des offres d'événements
 *
 * Ce module contient le composant DisplayedOffre qui affiche la liste des offres
 * disponibles pour un événement donné avec la gestion des réservations.
 * Il intègre le système de panier Redux et gère les états de chargement.
 *
 * ## Fonctionnalités principales
 * - Affichage en grille des offres disponibles
 * - Intégration avec Redux pour le panier
 * - Gestion des états de chargement et d'erreur
 * - Calcul des quantités réservées par offre
 * - Interface responsive (1 colonne mobile, 2 colonnes desktop)
 * - Actions de réservation et annulation en temps réel
 *
 * ## Gestion du panier
 * - Synchronisation avec l'état Redux du panier
 * - Calcul automatique des quantités par offre et événement
 * - Mise à jour en temps réel des quantités affichées
 * - Validation des réservations avec les places restantes
 *
 * ## États d'affichage
 * - **Chargement** : Indicateur pendant la récupération des offres
 * - **Erreur** : Message d'erreur si échec du chargement
 * - **Données** : Grille des cartes d'offres avec interactions
 *
 * ## Layout responsive
 * - Mobile : 1 colonne (grid-cols-1)
 * - Desktop : 2 colonnes (md:grid-cols-2)
 * - Espacement uniforme entre les cartes (gap-4)
 *
 * ## Intégration
 * - Utilisé dans ModalEvenement pour l'affichage des offres
 * - Connecté au hook useOffres pour les données
 * - Intégré avec le système de réservation global
 *
 * @group Components
 */

import {useOffres} from "@/hook/useOffre";
import CardOffre from "@/components/evenements/CardOffre";
import { useSelector } from "react-redux";
import { OffrePanier } from "@/type/achat/offrePanier";

/**
 * Props du composant DisplayedOffre
 */
type Props = {
  /** ID de l'événement pour lequel afficher les offres */
  evenementId: number;
  /** Nombre de places restantes disponibles pour l'événement */
  remainingTickets: number;
  /** Fonction appelée pour réserver des places pour une offre */
  onReservePlaces: (evenementId: number, offreId: number) => void;
  /** Fonction appelée pour annuler des réservations pour une offre */
  onUnReservePlaces: (evenementId: number, offreId: number) => void;
};

/**
 * Composant DisplayedOffre pour l'affichage et la gestion des offres d'événements.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant récupère et affiche toutes les offres disponibles sous forme de grille,
 * en intégrant les fonctionnalités de réservation et la synchronisation avec le panier.
 * Il gère automatiquement les états de chargement et les erreurs.
 *
 * @param props - Les propriétés du composant
 * @param props.evenementId - ID de l'événement concerné
 * @param props.remainingTickets - Places restantes pour validation
 * @param props.onReservePlaces - Callback pour réserver des places
 * @param props.onUnReservePlaces - Callback pour annuler des réservations
 *
 * @returns Grille d'offres avec gestion des réservations ou états de chargement/erreur
 *
 * @example
 * ```tsx
 * // Utilisation dans un modal d'événement
 * <DisplayedOffre
 *   evenementId={evenement.id}
 *   remainingTickets={remainingTickets}
 *   onReservePlaces={(eventId, offerId) => reservePlaces(eventId, offerId)}
 *   onUnReservePlaces={(eventId, offerId) => unReservePlaces(eventId, offerId)}
 * />
 *
 * // Avec gestion d'état de réservation
 * const handleReservation = useCallback((eventId: number, offerId: number) => {
 *   // Logique de réservation
 *   updateReservations(eventId, offerId);
 * }, []);
 * ```
 */
export default function DisplayedOffre({evenementId, remainingTickets, onReservePlaces, onUnReservePlaces}: Props) {
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