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
                const response = await axios.get('/api/categories');
                setCategories(response.data.categories || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <p>Loading categories...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (categories.length === 0) {
        return <p>No categories available.</p>;
    }

    return (
        <ul className="event-categories-list">
            {categories.map((category) => (
                <li key={category.id} className="category-item">
                    <Link to={`/events/${category.name.toLowerCase()}`}>
                        {category.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default EventCategories;