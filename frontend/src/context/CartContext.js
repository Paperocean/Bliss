import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        if (cart.length === 0 && cartMessage === '') {
            setCartMessage('Koszyk jest pusty. Dodaj bilety, aby kontynuować.');
        }
    }, [cart, cartMessage]);

    const addToCart = (ticket_id) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.ticket_id === ticket_id);

            if (existingItem) {
                alert('This item is already in your cart.');
                return prevCart; 
            }

            setCartMessage('');
            return [...prevCart, { ticket_id }];
        });
    };

    const removeFromCart = (ticket_id) => {
        setCart((prevCart) => prevCart.filter((item) => item.ticket_id !== ticket_id));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart'); 
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            cartMessage, 
            setCartMessage
        }}>
            {children}
        </CartContext.Provider>
    );
};
