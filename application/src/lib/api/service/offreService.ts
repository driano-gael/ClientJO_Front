import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Offre} from '@/type/achat/offre';



export class OffreService {
  private static readonly BASE_PATH = '/offre';

  /**
   * Récupère toutes les offres
   * Route Django: path('offre/', OffreListView.as_view(), name='offre-list')
   */
  static async getAllOffre(): Promise<Offre[]> {
    const url = `${this.BASE_PATH}/`;
    return fetchApi<Offre[]>(url, {}, true);
  }
}
