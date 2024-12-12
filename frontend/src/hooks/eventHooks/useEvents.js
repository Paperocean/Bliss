import { useState, useEffect } from 'react';
import { getEventsRequest } from '../../services/eventService';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await getEventsRequest();
        if (response.success) {
          setEvents(response.events || []);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadowac wydarzeń.'
          );
        }
      } catch (err) {
        console.error('Error geting events:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;
