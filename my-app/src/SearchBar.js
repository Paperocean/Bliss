import React from 'react';

const SearchBar = () => {
    return (
        <div className="search-bar w-1/2 flex items-center bg-gray-100 p-2 rounded-md shadow-md">
            <input 
                className="flex-grow p-2 rounded-l-md border-none focus:outline-none" 
                placeholder="Wyszukaj..." 
                type="text" 
            />
            <button className="bg-blue-500 p-2 rounded-r-md hover:bg-blue-600 focus:outline-none">
                <i className="fas fa-search text-white" />
            </button>
        </div>
    );
};

export default SearchBar;