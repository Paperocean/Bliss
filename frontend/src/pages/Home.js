import React, { useState } from 'react';
import useEvents from 'hooks/useEvents';
import useCategories from 'hooks/useCategories';

import SearchBar from 'components/props/SearchBar/SearchBar';
import Select from 'components/props/Select/Select';
import EventList from 'components/EventList/EventList';
import ErrorMessage from 'components/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';

const Home = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  return (
    <ContentWrapper>
      {/* Search and Filter Row */}
      <div className="search-and-filter-row">
        <SearchBar
          placeholder="Szukaj wydarzenia..."
          value=""
          onChange={() => {}}
        />
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <ErrorMessage message={categoriesError} />
        ) : (
          <Select
            options={categories.map((category) => ({
              value: category.name,
              label: category.name,
            }))}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Wszystkie kategorie"
          />
        )}
      </div>

      {/* Event List */}
      {eventsError ? (
        <ErrorMessage message={eventsError} />
      ) : eventsLoading ? (
        <p>Loading events...</p>
      ) : (
        <EventList events={filteredEvents} />
      )}
    </ContentWrapper>
  );
};

export default Home;
