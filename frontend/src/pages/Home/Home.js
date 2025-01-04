import React, { useState, useEffect } from 'react';
import useEvents from 'hooks/eventHooks/useEvents';
import useCategories from 'hooks/eventHooks/useCategories';

import SearchBar from 'components/props/SearchBar/SearchBar';
import Select from 'components/props/Select/Select';
import EventList from 'components/EventList/EventList';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import Button from 'components/props/Button/Button';

import './Home.css';

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    meta,
  } = useEvents(currentPage, 3, search, selectedCategory);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (meta?.currentPage < meta?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (meta?.currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    document.title = 'Bliss';
  }, []);
  return (
    <ContentWrapper>
      {/* Search and Filter Row */}
      <div className="search-and-filter-row">
        <SearchBar
          placeholder="Szukaj wydarzenia..."
          value={search}
          onChange={handleSearchChange}
        />
        {categoriesLoading ? (
          <p>Ładowanie kategorii...</p>
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
        <p>Ładowanie wydarzeń...</p>
      ) : (
        <>
          <EventList events={events} />
          <div className="pagination-controls">
            <Button
              onClick={handlePrevPage}
              disabled={meta?.currentPage === 1}
              className="pagination-button"
            >
              &lt;
            </Button>
            <div className="pagination-info">
              Strona {meta?.currentPage} z {meta?.totalPages}
            </div>
            <Button
              onClick={handleNextPage}
              disabled={meta?.currentPage === meta?.totalPages}
              className="pagination-button"
            >
              &gt;
            </Button>
          </div>
        </>
      )}
    </ContentWrapper>
  );
};

export default Home;
