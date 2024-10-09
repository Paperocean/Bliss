import React from 'react';
import logo from './images/icon.png'; // Popraw ścieżkę do logo

const Navbar = () => {
  return (
    <div className="nav-container flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-3">
        <img alt="Logo" className="w-10 h-10 object-contain mr-4" src={logo} />
        <h1 className="text-4xl font-bold">ConTic</h1>
      </div>
      <nav className="flex space-x-8 text-lg">
        <a className="text-xl hover:text-gray-400" href="/wydarzenia">Wydarzenia</a>
        <a className="text-xl hover:text-gray-400" href="/koszyk">Koszyk</a>
        <a className="text-xl hover:text-gray-400" href="/profil">Profil</a>
        <a className="text-xl hover:text-gray-400" href="/logowanie">Logowanie</a>
      </nav>
    </div>
  );
};

export default Navbar;
