import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Import ikony z react-icons

const SearchBar = () => {
  return (
    <div className="search-bar flex items-center">
      <input
        type="text"
        placeholder="Szukaj wydarzeń..."
        className="flex-grow p-2 rounded-l-full"
      />
      <button className="p-2 bg-blue-500 text-white rounded-r-full">
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;