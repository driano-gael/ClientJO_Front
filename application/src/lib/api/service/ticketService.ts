import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Ticket} from "@/type/achat/ticket";

/**
 * Service pour la gestion des tickets clients
 */
export class TicketService {
  /** Chemin de base pour les endpoints des tickets clients */
  private static readonly BASE_PATH = '/ticket-client';

  /**
   * Récupère tous les tickets du client connecté
   * @returns Promise<Ticket[]> - Liste des tickets du client
   * @throws Error - En cas d'erreur de l'API ou de réseau
   */
  static async getAllClientTickets(): Promise<Ticket[]> {
    const url = `${this.BASE_PATH}/`;
    return fetchApi<Ticket[]>(url, {}, true);
  }

  /**
   * Récupère un ticket spécifique du client connecté
   * @param _id - ID du ticket à récupérer
   * @returns Promise<Ticket> - Le ticket correspondant
   * @throws Error - En cas d'erreur de l'API ou si le ticket n'existe pas
   */
  static async getClientTicket(_id: number): Promise<Ticket> {
    const url = `${this.BASE_PATH}/${_id}/`;
    return fetchApi<Ticket>(url, {}, true);
  }
}
