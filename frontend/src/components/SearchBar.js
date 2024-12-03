import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Szukaj wydarzenia..."
      />
      <button>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
