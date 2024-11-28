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

    const addToCart = (ticket_id, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.ticket_id === ticket_id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.ticket_id === ticket_id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevCart, { ticket_id, quantity }];
        });
    };

    const removeFromCart = (ticket_id) => {
        setCart((prevCart) => prevCart.filter((item) => item.ticket_id !== ticket_id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
