import React from 'react';
import { Link } from 'react-router-dom';

const EventCategories = () => {
  const categories = [
    { id: 1, name: 'Rock' },
    { id: 2, name: 'Party' },
    { id: 3, name: 'Pop' },
    { id: 4, name: 'Electronic' },
    { id: 5, name: 'Hip-Hop' },
  ];

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