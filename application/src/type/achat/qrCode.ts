import {Ticket} from "@/type/achat/ticket";

/**
 * Interface représentant un QR code associé à un ticket
 */
export default interface QRCode {
  /** Identifiant unique du QR code */
  id: number;
  /** Ticket associé au QR code */
  ticket: Ticket;
  /** Données encodées du QR code */
  data: string;
}