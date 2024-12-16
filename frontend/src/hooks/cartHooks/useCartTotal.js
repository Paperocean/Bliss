import { useState, useEffect } from 'react';
import { calculateCartRequest } from 'services/cartService';

const useCartTotal = (cart) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTotalPrice = async () => {
      setLoading(true);
      setError(null);

      try {
        if (cart.length === 0) {
          setTotalPrice(0);
          return;
        }

        const { totalPrice } = await calculateCartRequest(cart);
        const parsedPrice = parseFloat(totalPrice);
        setTotalPrice(!isNaN(parsedPrice) ? parsedPrice : 0);
      } catch (err) {
        setError('Nie udało się obliczyć ceny koszyka.');
        setTotalPrice(0);
      } finally {
        setLoading(false);
      }
    };

    getTotalPrice();
  }, [cart]);

  return { totalPrice, loading, error };
};

export default useCartTotal;
