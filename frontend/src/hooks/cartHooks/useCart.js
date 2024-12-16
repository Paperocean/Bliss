import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';

const useCart = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addSeatToCart = (seat) => {
    try {
      if (!seat) {
        throw new Error('Nie wybrano wydarzenia.');
      }

      const isSeatInCart = cart.some(
        (item) => item.ticket_id === seat.ticket_id
      );

      if (isSeatInCart) {
        throw new Error(`Miejsce ${seat.seat_label} jest już w twoim koszyku.`);
      }

      addToCart(seat.ticket_id);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeSeatFromCart = (ticket_id) => {
    try {
      if (!ticket_id) {
        throw new Error('Nie dostarczono ID biletu.');
      }

      removeFromCart(ticket_id);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return { cart, addSeatToCart, removeSeatFromCart, loading, error };
};

export default useCart;
