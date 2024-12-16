import { useState, useEffect } from 'react';
import { getAvailableSeatsRequest } from 'services/ticketService';

const useAvailableSeats = (eventId) => {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const loadSeats = async () => {
      try {
        const response = await getAvailableSeatsRequest(eventId);
        setSeats(response || []);
      } catch (err) {
        console.error('Error geting available seats:', err.message);
        setError('Nie udało się załadować miejsc.');
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [eventId]);

  return { seats, loading, error };
};

export default useAvailableSeats;
