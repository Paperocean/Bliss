import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === product.id);
          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
          }
          return [...prevCart, { ...product, quantity }];
        });
      };

      const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      };

      return (
        <CartContext.Provider value={{ cart, totalItems, addToCart, removeFromCart }}>
            { children }
        </CartContext.Provider>
      )
};
