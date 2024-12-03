import React from 'react';
import '../styles/Button.css';

function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default Button;
