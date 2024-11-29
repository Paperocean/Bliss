import { useState, useEffect } from 'react';
import { fetchAvailableSeats } from '../services/ticketService';

const useAvailableSeats = (eventId) => {
    const [seats, setSeats] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        const loadSeats = async () => {
            try {
                const response = await fetchAvailableSeats(eventId);
                setSeats(response || []);
            } catch (err) {
                console.error('Error fetching available seats:', err.message);
                setError('Failed to load seats. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadSeats();
    }, [eventId]);

    return { seats, loading, error };
};

export default useAvailableSeats;
