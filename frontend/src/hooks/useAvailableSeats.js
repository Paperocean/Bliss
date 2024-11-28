import { useState, useEffect } from 'react';
import { fetchAvailableSeats } from '../services/ticketService';

const useAvailableSeats = (eventId) => {
    const [seats, setSeats] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        const loadSeats = async () => {
            try {
                setLoading(true);
                const response = await fetchAvailableSeats(eventId);
                setSeats(response || []);
                setError('');
            } catch (err) {
                console.error('Error fetching available seats:', err.message);
                setError('Failed to load seats. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadSeats();
    }, [eventId]);

    return { seats, error, loading };
};

export default useAvailableSeats;
