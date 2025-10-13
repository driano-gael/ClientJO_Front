import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Epreuve, EpreuveCardType, EpreuveFilters} from '@/type/evenement/epreuve';
import {formatDateFr, formatHeure} from "@/utils/formatDate";

export type { EpreuveFilters } from '@/type/evenement/epreuve';

/**
 * Service pour la gestion des épreuves sportives
 */
export class EpreuveService {
  /** Chemin de base pour les endpoints des épreuves */
  private static readonly BASE_PATH = '/epreuve';

  /**
   * Récupère toutes les épreuves avec filtres optionnels
   * @param filters - Filtres optionnels pour la recherche et pagination
   * @returns Promise<Epreuve[]> - Liste des épreuves
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * Route Django: path('epreuve/', EpreuveListView.as_view(), name='epreuve-list')
   */
  static async getAllEpreuves(filters?: EpreuveFilters): Promise<Epreuve[]> {
    let url = `${this.BASE_PATH}/`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.libelle) params.append('search', filters.libelle);
      if (filters.disciplineId) params.append('disciplineId', filters.disciplineId.toString());
      if (filters.date) params.append('date', filters.date);
      if (filters.tour) params.append('tour', filters.tour);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return fetchApi<Epreuve[]>(url,{},false);
  }

  /**
   * Récupère une épreuve par son ID
   * @param id - ID de l'épreuve à récupérer
   * @returns Promise<Epreuve> - L'épreuve correspondante
   * @throws Error - En cas d'erreur de l'API ou si l'épreuve n'existe pas
   * Route Django: path('epreuve/<int:pk>/', EpreuveDetailView.as_view(), name='epreuve-detail')
   */
  static async getEpreuveById(id: number): Promise<Epreuve> {
    return fetchApi<Epreuve>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Transforme une liste d'épreuves en format carte pour l'affichage
   * @param epreuves - Liste des épreuves à transformer
   * @returns EpreuveCardType[] - Liste des épreuves au format carte
   */
  static transformToCardType(epreuves: Epreuve[]): EpreuveCardType[] {
    return epreuves.map(mapEpreuveToCard);
  }

  /**
   * Récupère toutes les épreuves directement au format carte pour l'affichage
   * @param filters - Filtres optionnels pour la recherche et pagination
   * @returns Promise<EpreuveCardType[]> - Liste des épreuves au format carte
   * @throws Error - En cas d'erreur de l'API ou de réseau
   */
  static async getAllEvenementsAsCards(filters?: EpreuveFilters): Promise<EpreuveCardType[]> {
    const epreuves = await this.getAllEpreuves(filters);
    return this.transformToCardType(epreuves);
  }
}

export function mapEpreuveToCard(epreuve: Epreuve): EpreuveCardType {
  return {
    id: epreuve.id,
    date: formatDateFr(epreuve.evenement?.date) || "Date Inconnue",
    dateRaw: epreuve.evenement?.date || "", // Conserver la date brute
    discipline: epreuve.discipline?.nom || "Inconnu",
    genre: epreuve.genre || "Inconnu",
    libelle: epreuve?.libelle,
    tour: epreuve.tour || "Inconnu",
    lieu: epreuve.evenement?.lieu?.nom || "Lieu inconnu",
    heure: formatHeure(epreuve.evenement?.horraire) || "horaire inconnu",
    icone: epreuve.discipline.icone || ""
  };

}
