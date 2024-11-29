import React from 'react';
import { Link } from 'react-router-dom';
import useCategories from '../../hooks/useCategories'; 
import ErrorMessage from '../../components/ErrorMessage'; 

const EventCategories = () => {
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(); 


    if (categoriesLoading) return <p>Loading categories...</p>;
    if (categoriesError) return <ErrorMessage message={categoriesError} />;
    if (!categories.length) return <p>No categories available.</p>;
    
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
