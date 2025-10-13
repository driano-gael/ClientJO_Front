import {Lieu} from "@/type/evenement/lieu";
import {Epreuve} from "@/type/evenement/epreuve";

/**
 * Interface représentant un événement sportif
 */
export interface Evenement {
  /** Identifiant unique de l'événement */
  id: number;
  /** Description de l'événement */
  description: string;
  /** Lieu où se déroule l'événement */
  lieu: Lieu;
  /** Date de l'événement au format string */
  date: string;
  /** Horaire de l'événement */
  horraire: string;
  /** Liste des épreuves de l'événement */
  epreuves: Epreuve[];
  /** Nombre total de places disponibles */
  nb_place_total: number;
  /** Nombre de places restantes */
  nb_place_restante: number;
}
