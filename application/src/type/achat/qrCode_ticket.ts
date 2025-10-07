import {Ticket} from "@/type/achat/ticket";

export default interface QrCodeTicket{
    id: number;
    data: string;
    ticket : Ticket
}