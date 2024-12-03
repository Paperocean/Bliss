import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import EventList from '../components/EventList';
import useEvents from '../hooks/useEvents';
import useCategories from '../hooks/useCategories';
import ErrorMessage from '../components/ErrorMessage'; 
import '../styles/EventList.css';
import '../styles/Select.css';

function Home() {
  const { events, loading: eventsLoading, error: eventsError } = useEvents(); 
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(); // Fetch categories
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  return (
    <div className="content-section">
      <div className="search-and-filter-row">
        <SearchBar />
        {categoriesLoading ? (
          <p>Ładowanie kategorii...</p>
        ) : categoriesError ? (
          <ErrorMessage message={categoriesError} />
        ) : (
          <select
            className="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {eventsError && <ErrorMessage message={eventsError} />}
      {eventsLoading ? (
        <p>Ładowanie wydarzeń...</p>
      ) : (
        <EventList events={filteredEvents} />
      )}
    </div>
  );
}

export default Home;
