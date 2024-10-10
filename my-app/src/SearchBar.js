import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Import ikony z react-icons

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Szukaj wydarzeń..."
      />
      <button>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;