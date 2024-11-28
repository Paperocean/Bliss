import { useState, useEffect } from 'react';
import { fetchEventsByCategory } from '../services/eventService';

const useEventsByCategory = (category) => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const response = await fetchEventsByCategory(category);
                setEvents(response.events || []);
                setError('');
            } catch (err) {
                console.error('Error fetching events by category:', err.message);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [category]);

    return { events, error, loading };
};

export default useEventsByCategory;
