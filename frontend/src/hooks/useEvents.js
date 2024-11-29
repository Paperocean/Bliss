import { useState, useEffect } from 'react'
import { fetchEvents } from '../services/eventService'

const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await fetchEvents();
                if (response.success) {
                    setEvents(response.events || []);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching events:', err.message);
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    return { events, loading, error };
};

export default useEvents;