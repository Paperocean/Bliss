import { useState, useEffect } from 'react';
import { getEventRequest } from '../../services/eventService';

const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await getEventRequest(eventId);
        if (response.success) {
          setEvent(response.data || null);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadować szczegółów wydarzenia.'
          );
        }
      } catch (err) {
        console.error('Error getting event:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  return { event, loading, error };
};

export default useEvent;
