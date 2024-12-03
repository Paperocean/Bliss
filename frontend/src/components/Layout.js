import React from 'react';
import Header from './Header';
import '../styles/App.css'; 

function Layout({ children }) {
  return (
    <div className="container">
      <Header />
      <main className="main">
        {children} 
      </main>
    </div>
  );
}

export default Layout;
