import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from 'context/CartContext';
import { getEventByTicketRequest } from 'services/ticketService';
import { purchaseRequest } from 'services/transactionService';
import { calculateCartRequest } from 'services/cartService';
import 'styles/Table.css';

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [eventDetails, setEventDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTotalPrice = async () => {
      if (cart.length === 0) {
        setTotalPrice(0);
        return;
      }

      const { totalPrice } = await calculateCartRequest(cart).catch(() => ({
        totalPrice: 0,
      }));
      const parsedPrice = parseFloat(totalPrice);
      setTotalPrice(!isNaN(parsedPrice) ? parsedPrice : 0);
    };

    getTotalPrice();
  }, [cart, eventDetails]);

  useEffect(() => {
    const loadEventDetails = async () => {
      const details = {};
      const missingDetails = cart.filter(
        (item) => !eventDetails[item.ticket_id]
      );

      for (const item of missingDetails) {
        const data = await getEventByTicketRequest(item.ticket_id).catch(
          () => null
        );
        if (data) {
          details[item.ticket_id] = data;
        }
      }

      if (Object.keys(details).length > 0) {
        setEventDetails((prevDetails) => ({ ...prevDetails, ...details }));
      }
    };

    if (cart.length > 0) {
      loadEventDetails();
    }
  }, [cart]);

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await purchaseRequest(cart);

      if (response.success) {
        setSuccessMessage('Purchase successful!');

        cart.forEach((item) => removeFromCart(item.ticket_id));
        setTotalPrice(0);
        setEventDetails({});
      } else {
        setErrorMessage('Failed to complete the purchase.');
      }
    } catch (error) {
      console.error('Error during purchase:', error.message);
      setErrorMessage('An error occurred while processing your purchase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <h1>Koszyk</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {cart.length === 0 ? (
        <p className="empty-cart-message">Twój koszyk jest pusty.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID Biletu</th>
              <th>Wydarzenie</th>
              <th>Miejsce</th>
              <th>Cena</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const event = eventDetails[item.ticket_id];
              return (
                <tr key={item.ticket_id}>
                  <td>{item.ticket_id}</td>
                  <td>{event ? event.title : 'Ładowanie...'}</td>
                  <td>{event ? event.seat_label : 'Ładowanie...'}</td>
                  <td>{event ? `${event.price} zł` : 'Ładowanie...'}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => removeFromCart(item.ticket_id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {cart.length > 0 && (
        <div className="cart-footer">
          <p className="total-price">
            Łącznie: <b>{totalPrice.toFixed(2)} zł</b>
          </p>
          <button
            className="button button-primary"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Przetwarzanie...' : 'Dokonaj zakupu'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
