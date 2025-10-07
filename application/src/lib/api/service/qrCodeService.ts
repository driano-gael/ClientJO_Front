import QrCodeTicket from "@/type/achat/qrCode_ticket";
import {fetchApi} from "@/lib/api/core/fetchWrappers";


export class QrCodeService {
  private static readonly BASE_PATH = '/qr_code_service/clientget/';

  /**
   * Récupère un qrCode pour un ticket donné s'il existe sinon il le crée
   */
  static async getTicketClientQrCode(_ticket_id: number): Promise<QrCodeTicket> {
    const url = `${this.BASE_PATH}/`;
    return fetchApi<QrCodeTicket>(url, {
        method: 'POST',
        body: JSON.stringify({ticket_id: _ticket_id}),
        headers: {
          'Content-Type': 'application/json',
        },
    }, true);
  }
}

