export type OffrePanier = {
  evenementId: number;
  offreId: number;
  quantity: number;
};

export interface PanierState {
  items: OffrePanier[];
}
