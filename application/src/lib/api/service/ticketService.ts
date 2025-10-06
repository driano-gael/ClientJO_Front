import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {Ticket} from "@/type/achat/ticket";

export class TicketService {
  private static readonly BASE_PATH = '/ticket-client';

  /**
   * Récupère toutes les tickets du client
   */
  static async getAllClientTickets(): Promise<Ticket[]> {
    const url = `${this.BASE_PATH}/`;
    return fetchApi<Ticket[]>(url, {}, true);
  }

  /**
   * Récupère un ticket du client
   */
    static async getClientTicket(_id: number): Promise<Ticket> {
    const url = `${this.BASE_PATH}/${_id}/`;
    return fetchApi<Ticket>(url, {}, true);
  }
}
