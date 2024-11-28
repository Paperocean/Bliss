import React from 'react';
import { Link } from 'react-router-dom';
import useCategories from '../../hooks/useCategories'; 
import ErrorMessage from '../../components/ErrorMessage'; 

const EventCategories = () => {
    const { categories, error } = useCategories(); 

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (categories.length === 0) {
        return <p>No categories found.</p>;
    }

    return (
        <ul className="event-categories-list">
            {categories.map((category) => (
                <li key={category.name} className="category-item">
                    <Link to={`/events/${category.name}`}>
                        {category.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default EventCategories;
