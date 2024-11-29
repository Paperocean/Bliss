import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

const useCart = () => {
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const [error, setError] = useState(null);

    const addSeatToCart = (seat) => {
        try {
            if (!seat) {
                throw new Error('No seat selected.');
            }

            const isSeatInCart = cart.some((item) => item.ticket_id === seat.ticket_id);

            if (isSeatInCart) {
                throw new Error(`Seat ${seat.seat_label} is already in your cart.`);
            }

            addToCart(seat.ticket_id);
            setError(null); 
        } catch (err) {
            setError(err.message); 
        }
    };

    const removeSeatFromCart = (ticket_id) => {
        try {
            if (!ticket_id) {
                throw new Error('No ticket ID provided.');
            }

            removeFromCart(ticket_id);
            setError(null);
        } catch (err) {
            setError(err.message); 
        }
    };

    return { cart, addSeatToCart, removeSeatFromCart, error };
};

export default useCart;
