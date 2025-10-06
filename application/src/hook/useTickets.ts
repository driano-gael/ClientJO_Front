import {useState, useEffect} from "react";
import {Ticket} from "@/type/achat/ticket";
import {TicketService} from "@/lib/api/service/ticketService";


/**
 * Hook personnalisé pour récupérer les tickets
 */
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await TicketService.getAllClientTickets();
        console.log("data", data);
        setTickets(data);
      } catch (e) {
        const err = e as Error;
        console.error("erreur", err.message);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, loading, error };
}

