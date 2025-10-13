import {fetchApi} from '@/lib/api/core/fetchWrappers';
import QRCode from "@/type/achat/qrCode";

/**
 * Service pour la gestion des QR codes des tickets
 */
export class QrCodeService {
  /** Chemin de base pour les endpoints des QR codes */
  private static readonly BASE_PATH = '/qr_code_service';

  /**
   * Récupère ou génère le QR code d'un ticket client
   * @param _ticketID - ID du ticket pour lequel générer le QR code
   * @returns Promise<QRCode> - Le QR code généré ou existant
   * @throws Error - En cas d'erreur de l'API ou si le ticket n'existe pas
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
