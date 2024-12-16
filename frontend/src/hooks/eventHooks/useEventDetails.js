import { useState, useEffect } from 'react';
import { getEventByTicketRequest } from 'services/ticketService';

const useEventDetails = (cart) => {
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      setLoading(true);
      setError(null);

      const details = {};

      try {
        const missingDetails = cart.filter(
          (item) => !eventDetails[item.ticket_id]
        );

        for (const item of missingDetails) {
          const data = await getEventByTicketRequest(item.ticket_id).catch(
            () => null
          );
          if (data) {
            details[item.ticket_id] = data;
          }
        }

        if (Object.keys(details).length > 0) {
          setEventDetails((prevDetails) => ({ ...prevDetails, ...details }));
        }
      } catch (err) {
        setError('Nie udało się załadować szczegółów wydarzeń.');
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      loadEventDetails();
    }
  }, [cart]);

  return { eventDetails, loading, error };
};

export default useEventDetails;
