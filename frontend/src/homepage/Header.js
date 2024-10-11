import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header-container">
      <h1 className="header-title">BLISS</h1>
      <nav className="nav-links">
        <Link to="/event">Wydarzenia</Link>
        <Link to="/cart">Koszyk</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/login">Logowanie</Link>
      </nav>
    </header>
  );
};

export default Header;