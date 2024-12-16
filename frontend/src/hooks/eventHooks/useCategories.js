import { useState, useEffect } from 'react';
import { getCategoriesRequest } from '../../services/eventService';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesRequest();
        if (response.success) {
          setCategories(response.categories || []);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error('Error geting categories:', err.message);
        setError('Nie udało się załadować kategorii');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
