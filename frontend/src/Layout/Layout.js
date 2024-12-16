import React from 'react';
import Header from '../components/Header/Header';

const Layout = ({ children, cartItems, isLoggedIn }) => {
  return (
    <div className="container">
      <Header cartItems={cartItems} isLoggedIn={isLoggedIn} />
      <main className="main">{children}</main>
    </div>
  );
};

export default Layout;
