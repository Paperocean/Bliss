import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/eventService';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                if (response.success) {
                    setCategories(response.categories);
                    setError('');
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching categories:', err.message);
                setError('Failed to load categories');
            }
        };

        loadCategories();
    }, []);

    return { categories, error };
};

export default useCategories;
