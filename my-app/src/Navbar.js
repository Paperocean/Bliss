import React from 'react';

const Navbar = () => {
  return (
    <div className="nav-container">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">ConTic</h1>
        <img alt="Logo" className="w-12 h-12" height="50" src="https://placehold.co/50x50" width="50" />
      </div>
      <nav className="flex space-x-8 text-lg">
        <a className="text-xl" href="#">Wydarzenia</a>
        <a className="text-xl" href="#">Koszyk</a>
        <a className="text-xl" href="#">Profil</a>
        <a className="text-xl" href="#">Logowanie</a>
      </nav>
    </div>
  );
};

export default Navbar;