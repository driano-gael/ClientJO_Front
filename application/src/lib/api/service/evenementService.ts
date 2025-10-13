import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Evenement} from "@/type/evenement/evenement";

/**
 * Interface définissant les filtres disponibles pour les événements
 */
export interface EvenementFilters {
  /** Filtrage par description (recherche partielle) */
  description?: string;
  /** Filtrage par lieu */
  lieuId?: number;
  /** Date de début pour filtrer par période */
  dateDebut?: string;
  /** Date de fin pour filtrer par période */
  dateFin?: string;
  /** Numéro de page pour la pagination */
  page?: number;
  /** Nombre d'éléments par page */
  limit?: number;
  /** Champ de tri */
  sortBy?: 'date' | 'description' | 'lieu';
  /** Ordre de tri */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service pour la gestion des événements
 */
export class EvenementService {
  /** Chemin de base pour les endpoints des événements */
  private static readonly BASE_PATH = '/evenement';

  /**
   * Récupère tous les événements avec filtres optionnels
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise<Evenement[]> - Liste des événements
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * Route Django: path('evenement/', EvenementListView.as_view(), name='evenement-list')
   */
  static async getAllEvenements(filters?: EvenementFilters): Promise<Evenement[]> {
    let url = `${this.BASE_PATH}/`;

    // Construction des paramètres de requête si des filtres sont fournis
    if (filters) {
      const params = new URLSearchParams();
      if (filters.description) params.append('description', filters.description);
      if (filters.lieuId) params.append('lieuId', filters.lieuId.toString());
      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      // Ajout des paramètres à l'URL
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return fetchApi<Evenement[]>(url);
  }

  /**
   * Récupère un événement par son ID
   * @param id - ID de l'événement à récupérer
   * @returns Promise<Evenement> - L'événement correspondant
   * @throws Error - En cas d'erreur de l'API ou si l'événement n'existe pas
   * Route Django: path('evenement/<int:pk>/', EvenementDetailView.as_view(), name='evenement-detail')
   */
  static async getEvenementById(id: number): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/${id}/`);
  }

    static async getEvenementByEpreuveId(id: number): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/by-epreuve/${id}/`, {}, false);
  }

}
