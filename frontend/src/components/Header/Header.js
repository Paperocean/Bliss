import React, { useContext, useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

import CartDropdown from '../CartDropdown/CartDropdown';
import logo from '../../assets/logo.svg';

import './Header.css';

const Header = () => {
  const { cart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);

  const [isCartDropdownVisible, setIsCartDropdownVisible] = useState(false);

  const toggleCartDropdown = () => {
    setIsCartDropdownVisible((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <Link to="/" className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      {/* Navigation Section */}
      <nav className="icons-section">
        {/* Cart Icon with Badge */}
        <div className="cart-icon-container">
          <div className="cart-icon" onClick={toggleCartDropdown}>
            <FaShoppingCart className="header-icon" />
            {cart.length > 0 && (
              <span className="cart-count">
                {cart.length > 9 ? '9+' : cart.length}
              </span>
            )}
          </div>
          {/* Cart Dropdown */}
          <CartDropdown
            isVisible={isCartDropdownVisible}
            toggleVisibility={toggleCartDropdown}
          />
        </div>

        {/* Profile Icon */}
        <Link to={isLoggedIn ? '/profile' : '/login'} className="profile-icon">
          <FaUserCircle className="header-icon" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
