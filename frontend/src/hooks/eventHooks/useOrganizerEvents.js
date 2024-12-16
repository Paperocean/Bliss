import { useState, useEffect } from 'react';
import { getOrganizerEventsRequest } from '../../services/eventService';

const useOrganizerEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await getOrganizerEventsRequest();
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
}

export default useOrganizerEvents;