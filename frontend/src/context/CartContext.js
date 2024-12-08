import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (seat) => {
        if (!isLoggedIn) {
            alert('You need to log in before adding items to the cart.');
            return;
        }
    
        if (!seat.price || typeof seat.price !== 'number') {
            alert('Invalid price for the seat.');
            return;
        }
    
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.ticket_id === seat.ticket_id);
            if (existingItem) {
                alert('This seat is already in your cart.');
                return prevCart;
            }
    
            return [...prevCart, { 
                ticket_id: seat.ticket_id, 
                seat_label: seat.seat_label, 
                price: seat.price 
            }];
        });
    };
    

    const removeFromCart = (ticketId) => {
        setCart(cart.filter(item => item.ticket_id !== ticketId));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Function to update the cart by removing sold tickets
    const updateCartWithAvailableSeats = (soldTickets) => {
        setCart((prevCart) => {
            if (!Array.isArray(soldTickets)) {
                console.error('soldTickets is not an array');
                return prevCart;
            }
    
            // Filtrujemy koszyk, aby usunąć bilety, których ticket_id znajduje się w soldTickets
            return prevCart.filter(item => !soldTickets.includes(item.ticket_id));
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartWithAvailableSeats }}>
            {children}
        </CartContext.Provider>
    );
};
