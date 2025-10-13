import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Offre} from '@/type/achat/offre';

/**
 * Service pour la gestion des offres de billets
 */
export class OffreService {
  /** Chemin de base pour les endpoints des offres */
  private static readonly BASE_PATH = '/offre';

  /**
   * Récupère toutes les offres disponibles
   * @returns Promise<Offre[]> - Liste de toutes les offres
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * Route Django: path('offre/', OffreListView.as_view(), name='offre-list')
   */
  static async getAllOffre(): Promise<Offre[]> {
    const url = `${this.BASE_PATH}/`;
    return fetchApi<Offre[]>(url, {}, true);
  }
}
