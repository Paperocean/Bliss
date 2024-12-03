import React, { useState, useContext, useEffect } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { ReactComponent as Logo } from '../assets/logo.svg'; 
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CartDropdown from './CartDropdown';
import '../styles/Header.css';

const Header = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [shouldRender, setShouldRender] = useState(false);
    const [isCartDropdownVisible, setIsCartDropdownVisible] = useState(false);

    useEffect(() => {
        setShouldRender(true);
    }, [isLoggedIn]);

    const toggleCartDropdown = () => {
        setIsCartDropdownVisible((prev) => !prev);
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="header">
            <Link to="/" className="logo-section">
                <Logo className="logo" />
            </Link>
            <div className="icons-section">
                {/* Cart Icon */}
                <div className="cart-icon-container">
                    <div onClick={toggleCartDropdown} className="cart-icon">
                        <FaShoppingCart className="header-icon" title="Cart" />
                        {cart.length > 0 && (
                            <span className="cart-count">
                                {cart.length > 9 ? '9+' : cart.length}
                            </span>
                        )}
                    </div>
                    <CartDropdown
                        isVisible={isCartDropdownVisible}
                        toggleVisibility={toggleCartDropdown}
                    />
                </div>
                {/* Profile Icon */}
                <Link to={isLoggedIn ? "/profile" : "/login"} className="profile-icon">
                    <FaUserCircle className="header-icon" title="Profile" />
                </Link>
            </div>
        </div>
    );
};

export default Header;
