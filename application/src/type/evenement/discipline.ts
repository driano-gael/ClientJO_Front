/**
 * @group Types & Interfaces
 */

/**
 * Interface représentant une discipline sportive
 */
export interface Discipline {
  /** Identifiant unique de la discipline */
  id: number;
  /** Nom de la discipline sportive */
  nom: string;
  /** Chemin vers l'icône de la discipline */
  icone: string;
}