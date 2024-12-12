import { useState, useEffect } from 'react';
import { fetchEventsByCategory } from '../../services/eventService';

const useEventsByCategory = (category) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEventsByCategory(category);
        setEvents(response.events || []);
      } catch (err) {
        console.error('Error fetching events by category:', err.message);
        setError('Nie udało się załadować wydarzeń.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [category]);

  return { events, loading, error };
};

export default useEventsByCategory;
