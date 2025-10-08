import {fetchApi} from '@/lib/api/core/fetchWrappers';
import QRCode from "@/type/achat/qrCode";

export class QrCodeService {
  private static readonly BASE_PATH = '/qr_code_service';

  /**
   * Récupère le qrcode d'un ticket client
   */
  static async getQrCodeClient(_ticketID: number): Promise<QRCode> {
    const url = `${this.BASE_PATH}/create_by_ticket/`;
    return fetchApi<QRCode>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"ticket_id": _ticketID}),
    }, true);
  }

}
