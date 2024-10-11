import React from 'react';

const Header = () => {
  return (
    <header className="header-container">
      <h1 className="header-title">BLISS</h1>
      <nav className="nav-links">
        <a href="/wydarzenia">Wydarzenia</a>
        <a href="/koszyk">Koszyk</a>
        <a href="/profil">Profil</a>
        <a href="/logowanie">Logowanie</a>
      </nav>
    </header>
  );
};

export default Header;