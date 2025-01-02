import { useState, useEffect } from 'react';
import { getEventsRequest } from '../../services/eventService';

const useEvents = (page = 1, limit = 10, search = '', category = '') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEventsRequest(page, limit, search, category);
        if (response.success) {
          setEvents(response.events);
          setMeta(response.meta);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadować wydarzeń.'
          );
        }
      } catch (err) {
        console.error('Error fetching events:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, limit, search, category]);

  return { events, loading, error, meta };
};

export default useEvents;
