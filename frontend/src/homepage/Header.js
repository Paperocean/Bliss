import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = () => {
  return (
    <header className="header-container">
      <h1 className="header-title">
        <Link to="/">BLISS</Link>
      </h1>
      <nav className="nav-links">
        <Link to="/event">Wydarzenia</Link>
        <Link to="/cart">Koszyk</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/login">Logowanie</Link>
      </nav>
      <SearchBar />
    </header>
  );
};

export default Header;