import { useState, useEffect, useCallback } from 'react';
import { getUsersTicketsRequest } from 'services/userService';
import { getEventByTicketRequest } from 'services/ticketService';
import QRCode from 'qrcode';
import { generateSecureHash } from 'utils/ticketHashing';

const useUserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              const secureHash = generateSecureHash(ticket.ticket_id);
              const qrCode = await QRCode.toDataURL(secureHash);
              return {
                ...ticket,
                event_name: event.title,
                location: event.location,
                start_time: event.start_time,
                qr_code: qrCode,
              };
            } catch {
              return {
                ...ticket,
                event_name: 'Nieznane wydarzenie',
                qr_code: null,
              };
            }
          })
        );
        setTickets(enrichedTickets);
      } else {
        throw new Error(response.message || 'Nie udało się załadować biletów.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetchTickets = useCallback(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, loading, error, refetchTickets };
};

export default useUserTickets;
