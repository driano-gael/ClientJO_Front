import {Offre} from "@/type/achat/offre";
import {Evenement} from "@/type/evenement/evenement";
import Client from "@/type/client/client";

/**
 * Interface représentant un ticket d'événement
 */
export interface Ticket {
  /** Identifiant unique du ticket */
  id: number;
  /** Offre associée au ticket */
  offre: Offre;
  /** Événement pour lequel le ticket est valide */
  evenement: Evenement;
  /** Client propriétaire du ticket */
  client: Client;
  /** Statut du ticket ('valide' ou 'invalide') */
  statut: string;
}