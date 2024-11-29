import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/eventService';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                if (response.success) {
                    setCategories(response.categories || []);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching categories:', err.message);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading, error };
};

export default useCategories;
