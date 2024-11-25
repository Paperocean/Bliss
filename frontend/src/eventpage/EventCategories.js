import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EventCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                // Wysyłanie zapytania do backendu, żeby pobrać wszystkie kategorie
                const response = await axios.get('http://localhost:5000/api/events');
                
                // Jeśli zapytanie jest udane, zapisujemy kategorie w stanie
                setCategories(response.data.categories || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []); // Pusta tablica oznacza, że zapytanie wykona się tylko raz po załadowaniu komponentu

    if (loading) {
        return <p>Loading categories...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (categories.length === 0) {
        return <p>No categories found.</p>;
    }

    return (
        <ul className="event-categories-list">
            {categories.map((category) => (
                <li key={category.category} className="category-item">
                    <Link to={`/events/${category.category}`}>
                        {category.category}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default EventCategories;