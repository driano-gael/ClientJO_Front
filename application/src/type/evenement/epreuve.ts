import {Discipline} from "@/type/evenement/discipline";
import {Evenement} from "@/type/evenement/evenement";

/**
 * Interface représentant une épreuve sportive
 */
export interface Epreuve {
  /** Identifiant unique de l'épreuve */
  id: number;
  /** Libellé de l'épreuve */
  libelle: string;
  /** Discipline sportive de l'épreuve */
  discipline: Discipline;
  /** Événement associé à l'épreuve (optionnel) */
  evenement?: Evenement | null;
  /** Genre de l'épreuve (homme/femme/mixte) */
  genre: string;
  /** Tour de l'épreuve (finale, demi-finale, etc.) */
  tour: string;
}

/**
 * Interface représentant une épreuve formatée pour l'affichage en carte
 */
export interface EpreuveCardType {
  /** Identifiant unique de l'épreuve */
  id: number;
  /** Date formatée pour l'affichage */
  date: string;
  /** Date au format brut */
  dateRaw: string;
  /** Nom de la discipline */
  discipline: string;
  /** Genre de l'épreuve */
  genre: string;
  /** Libellé de l'épreuve */
  libelle: string;
  /** Tour de l'épreuve */
  tour: string;
  /** Nom du lieu */
  lieu: string;
  /** Heure de l'épreuve */
  heure: string;
  /** Chemin vers l'icône de la discipline */
  icone: string;
}

/**
 * Interface définissant les filtres disponibles pour les épreuves
 */
export interface EpreuveFilters {
  /** Filtrer par libellé de l'épreuve */
  libelle?: string;
  /** Filtrer par identifiant de discipline */
  disciplineId?: number;
  /** Filtrer par date (format YYYY-MM-DD) */
  date?: string;
  /** Filtrer par tour */
  tour?: string;
  /** Critère de tri */
  sortBy?: 'date' | 'libelle';
  /** Ordre de tri */
  sortOrder?: 'asc' | 'desc';
}