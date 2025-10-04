import {Offre} from "@/type/achat/offre";
import {Evenement} from "@/type/evenement/evenement";

export interface Ticket {
  id: number;
  offre : Offre;
  evenement: Evenement;
}