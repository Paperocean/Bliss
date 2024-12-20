import { useState, useEffect, useCallback } from 'react';
import { getOrganizerEventsRequest } from '../../services/eventService';

const useOrganizerEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadEvents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getOrganizerEventsRequest();
            if (response.success) {
                setEvents(response.events || []);
            } else {
                throw new Error(
                    response.message || 'Nie udało się załadować wydarzeń.'
                );
            }
        } catch (err) {
            console.error('Error getting events:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    return { events, loading, error, refetch: loadEvents };
}

export default useOrganizerEvents;