import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Lieu} from '@/type/evenement/lieu';

export interface LieuFilters {
  nom?: string;
  page?: number;
  limit?: number;
}

export class LieuService {
  private static readonly BASE_PATH = '/lieu';

  /**
   * Récupère tous les lieux
   * Route Django: path('lieu/', LieuListView.as_view(), name='lieu-list')
   */
  static async getAllLieux(filters?: LieuFilters): Promise<Lieu[]> {
    let url = `${this.BASE_PATH}/`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.nom) params.append('search', filters.nom);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return fetchApi<Lieu[]>(url);
  }
}
