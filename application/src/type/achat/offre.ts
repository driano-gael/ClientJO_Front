/**
 * Interface représentant une offre de billet
 */
export interface Offre {
  /** Identifiant unique de l'offre */
  id: number;
  /** Libellé de l'offre */
  libelle: string;
  /** Nombre de personnes concernées par l'offre */
  nb_personne: number;
  /** Montant de l'offre en euros */
  montant: number;
  /** Description détaillée de l'offre */
  description: string;
}