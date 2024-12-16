import { useState, useEffect } from 'react';
import { getUsersTicketsRequest } from 'services/userService';
import { getEventByTicketRequest } from 'services/ticketService';

const useUserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUsersTicketsRequest();
        if (response.success) {
          const enrichedTickets = await Promise.all(
            response.tickets.map(async (ticket) => {
              try {
                const event = await getEventByTicketRequest(ticket.ticket_id);
                return { ...ticket, event_name: event.title };
              } catch {
                return { ...ticket, event_name: 'Nieznane wydarzenie' };
              }
            })
          );
          setTickets(enrichedTickets);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadować biletów.'
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, loading, error };
};

export default useUserTickets;
