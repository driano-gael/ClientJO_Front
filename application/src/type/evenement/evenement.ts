import {Lieu} from "@/type/evenement/lieu";
import {Epreuve} from "@/type/evenement/epreuve";

export interface Evenement {
  id: number;
  description: string;
  lieu: Lieu;
  date: string;
  horraire: string;
  epreuves: Epreuve[];
}
