import {Offre} from "@/type/achat/offre";
import {Evenement} from "@/type/evenement/evenement";
import Client from "@/type/client/client";

export interface Ticket {
  id: number;
  offre : Offre;
  evenement: Evenement;
  client: Client;
  statut: string; // 'valide' ou 'invalide'
}