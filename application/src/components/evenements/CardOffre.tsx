/**
 * @module components/evenements/CardOffre
 * Module de composant CardOffre pour la sélection d'offres de billets des Jeux Olympiques
 *
 * Ce module contient le composant CardOffre qui permet aux utilisateurs de visualiser et sélectionner
 * des offres de billets. Il affiche toutes les informations importantes d'une offre et permet
 * l'ajout/suppression au panier avec gestion intelligente des stocks.
 *
 * ## Informations affichées
 * - Libellé et description de l'offre
 * - Nombre de places incluses dans l'offre
 * - Prix de l'offre en euros
 * - Nombre de places restantes disponibles
 * - Quantité déjà sélectionnée (compteur visuel)
 *
 * ## Fonctionnalités principales
 * - Boutons + et - pour ajuster la quantité dans le panier
 * - Validation automatique du stock disponible avant ajout
 * - Désactivation des boutons selon les contraintes (stock épuisé, quantité minimum)
 * - Compteur visuel de la quantité sélectionnée
 * - Interface responsive avec design adaptatif
 *
 * ## Logique métier intégrée
 * - Vérifie que le stock restant permet l'ajout (remainingTickets >= offre.nb_personne)
 * - Empêche la suppression si quantité déjà à zéro
 * - Met à jour automatiquement l'affichage selon l'état du panier
 * - Intégration avec Redux pour la gestion globale du panier
 *
 * @module components/evenements/CardOffre
 * @group Components
 */

import {Offre} from "@/type/achat/offre";
import Image from 'next/image';

/**
 * Props du composant CardOffre
 */
export type CardOffreProps = {
  /** Offre de billet à afficher */
  offre: Offre;
  /** Nombre de tickets restants disponibles pour cet événement */
  remainingTickets: number;
  /** Fonction appelée pour ajouter cette offre au panier */
  onReservePlaces: () => void;
  /** Fonction appelée pour retirer cette offre du panier */
  onUnReservePlaces: () => void;
  /** Quantité de cette offre déjà présente dans le panier */
  quantityInCart: number;
};

/**
 * Composant CardOffre pour la sélection d'offres de billets.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @param props - Les propriétés du composant
 * @returns Carte d'offre interactive avec contrôles de quantité
 */
export default function CardOffre({offre, remainingTickets, onReservePlaces, onUnReservePlaces, quantityInCart}: CardOffreProps) {

  const handleAddOffer= () => {
    if(remainingTickets >= offre.nb_personne){
      onReservePlaces();
    }
  }
  const handleRemoveOffer= () => {
    if(quantityInCart > 0){
      onUnReservePlaces();
    }
  }
  return (
    <>
      <div className="flex flex-col items-center border border-accent rounded-[10px]">
        <h3 className="text-xl font-bold mb-2">{offre.libelle}</h3>
        <p className="mb-2">{offre.description}</p>
        <p className="mb-2">Places incluses : {offre.nb_personne}</p>
        <p className="text-lg font-semibold">Prix : {offre.montant} €</p>
        <div className="flex items-center bg-base-200 gap-3 p-1 mb-1 rounded-2xl">
          <button
          onClick={handleRemoveOffer}>
            <Image
              src="/images/minus.png"
              alt="moins"
              width={20}
              height={20}
            />
          </button>
          <span className="text-lg font-medium text-gray-800 min-w-[30px] text-center">
            {quantityInCart}
          </span>
          <button
          onClick={handleAddOffer}
          >
            <Image
              src="/images/add.png"
              alt="plus"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}