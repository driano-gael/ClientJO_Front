import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Discipline} from '@/type/evenement/discipline';

export interface DisciplineFilters {
  nom?: string; // Filtrage par nom (recherche partielle)
  page?: number; // Numéro de page pour la pagination
  limit?: number; // Nombre d'éléments par page
  sortBy?: 'nom'; // Champ de tri (actuellement seul 'nom' est supporté)
  sortOrder?: 'asc' | 'desc'; // Ordre de tri (ascendant ou descendant)
}

export class DisciplineService {
  // Chemin de base pour les endpoints des disciplines
  private static readonly BASE_PATH = '/discipline';

  /**
   * Récupère toutes les disciplines avec filtres optionnels
   *
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise<Discipline[]> - Liste des disciplines
   * @throws Error - En cas d'erreur de l'API ou de réseau
   *
   * Route Django : path('discipline/', DisciplineListView.as_view(), name='discipline-list')
   */
  static async getAllDisciplines(filters?: DisciplineFilters): Promise<Discipline[]> {
    let url = `${this.BASE_PATH}/`;

    // Construction des paramètres de requête si des filtres sont fournis
    if (filters) {
      const params = new URLSearchParams();
      if (filters.nom) params.append('search', filters.nom);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return fetchApi<Discipline[]>(url);
  }

  /**
   * Récupère une discipline par son ID
   *
   * @param id - ID de la discipline à récupérer
   * @returns Promise<Discipline> - La discipline correspondante
   * @throws Error - En cas d'erreur de l'API ou si la discipline n'existe pas
   *
   * Route Django: path('discipline/<int:pk>/', DisciplineDetailView.as_view(), name='discipline-detail')
   */
  static async getDisciplineById(id: number): Promise<Discipline> {
    return fetchApi<Discipline>(`${this.BASE_PATH}/${id}/`);
  }
}