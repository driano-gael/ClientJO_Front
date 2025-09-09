import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Epreuve, EpreuveCardType, EpreuveFilters} from '@/type/evenement/epreuve';
import {formatDateFr, formatHeure} from "@/utils/formatDate";

export class EpreuveService {
  private static readonly BASE_PATH = '/epreuve';

  /**
   * Récupère toutes les épreuves avec filtres optionnels
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
   * Route Django: path('epreuve/<int:pk>/', EpreuveDetailView.as_view(), name='epreuve-detail')
   */
  static async getEpreuveById(id: number): Promise<Epreuve> {
    return fetchApi<Epreuve>(`${this.BASE_PATH}/${id}/`);
  }

  static async getAllEvenementsAsCards(filters?: EpreuveFilters): Promise<EpreuveCardType[]> {
    const evenements = await this.getAllEpreuves(filters);
    return evenements.map(mapEpreuveToCard);
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
