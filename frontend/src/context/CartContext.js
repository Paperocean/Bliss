import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (ticketId, price, label) => {
        const exists = cart.find(item => item.ticketId === ticketId);
        if (exists) {
            alert(`Item ${label} is already in the cart.`);
            return;
        }
        setCart([...cart, { ticketId, price, label }]);
    };

    const removeFromCart = (ticketId) => {
        setCart(cart.filter(item => item.ticketId !== ticketId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
