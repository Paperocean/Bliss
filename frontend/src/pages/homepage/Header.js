import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { AuthContext } from '..//../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Header = () => {
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [shouldRender, setShouldRender] = useState(false);
    

    useEffect(() => {
      setShouldRender(true);
    }, [isLoggedIn, user]); 

    if (!shouldRender) {
      return null;
    }
    return (
        <header className="header-container">
            <h1 className="header-title">
                <Link to="/">BLISS</Link>
            </h1>
            <nav className="nav-links">
                <Link to="/event">Wydarzenia</Link>
                <Link to="/cart">Koszyk ({cart.length})</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">Profil</Link>
                        <Link to="#" onClick={logout}>
                            Wyloguj
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Logowanie</Link>
                        <Link to="/register">Rejestracja</Link>
                    </>
                )}
            </nav>
            <SearchBar />
        </header>
    );
};

export default Header;
