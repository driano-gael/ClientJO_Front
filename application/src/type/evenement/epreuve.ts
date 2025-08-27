import {Discipline} from "@/type/evenement/discipline";
import {Evenement} from "@/type/evenement/evenement";

export interface Epreuve {
  id: number;
  libelle: string;
  discipline: Discipline;
  evenement?: Evenement | null;
}