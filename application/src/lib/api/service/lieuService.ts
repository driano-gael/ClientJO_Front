import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Lieu} from '@/type/evenement/lieu';

/**
 * Interface définissant les filtres disponibles pour les lieux
 */
export interface LieuFilters {
  /** Filtrage par nom de lieu */
  nom?: string;
  /** Numéro de page pour la pagination */
  page?: number;
  /** Nombre d'éléments par page */
  limit?: number;
}

/**
 * Service pour la gestion des lieux d'événements
 */
export class LieuService {
  /** Chemin de base pour les endpoints des lieux */
  private static readonly BASE_PATH = '/lieu';

  /**
   * Récupère tous les lieux avec filtres optionnels
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise<Lieu[]> - Liste des lieux
   * @throws Error - En cas d'erreur de l'API ou de réseau
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

  /**
   * Récupère un lieu par son ID
   * @param id - ID du lieu à récupérer
   * @returns Promise<Lieu> - Le lieu correspondant
   * @throws Error - En cas d'erreur de l'API ou si le lieu n'existe pas
   * Route Django: path('lieu/<int:pk>/', LieuDetailView.as_view(), name='lieu-detail')
   */
  static async getLieuById(id: number): Promise<Lieu> {
    const url = `${this.BASE_PATH}/${id}/`;
    return fetchApi<Lieu>(url);
  }
}
