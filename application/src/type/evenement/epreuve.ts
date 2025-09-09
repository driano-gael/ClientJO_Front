import {Discipline} from "@/type/evenement/discipline";
import {Evenement} from "@/type/evenement/evenement";

export interface Epreuve {
  id: number;
  libelle: string;
  discipline: Discipline;
  evenement?: Evenement | null;
  genre: string;
  tour: string;
}

export interface EpreuveCardType {
  id: number;
  date: string;
  dateRaw: string;
  discipline: string;
  genre: string;
  libelle: string;
  tour: string;
  lieu: string;
  heure: string;
  icone:string
}

export interface EpreuveFilters {
  libelle?: string;
  disciplineId?: number;
  date?: string; // Format YYYY-MM-DD
  tour?: string;
  sortBy?: 'date' | 'libelle';
  sortOrder?: 'asc' | 'desc';
}