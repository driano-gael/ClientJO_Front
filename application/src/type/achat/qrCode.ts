import {Ticket} from "@/type/achat/ticket";

export default interface QRCode {
  id: number;
  ticket: Ticket;
  data: string; // Données du QR code (généralement une chaîne encodée)
}