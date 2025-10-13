/**
 * Type représentant une offre dans le panier
 */
export type OffrePanier = {
  /** Identifiant de l'événement */
  evenementId: number;
  /** Identifiant de l'offre */
  offreId: number;
  /** Quantité d'offres sélectionnées */
  quantity: number;
};

/**
 * Interface représentant l'état du panier
 */
export interface PanierState {
  /** Liste des offres dans le panier */
  items: OffrePanier[];
}
