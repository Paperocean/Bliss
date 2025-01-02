import React, { useContext, useState } from 'react';
import { CartContext } from 'context/CartContext';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import useCartTotal from 'hooks/cartHooks/useCartTotal';
import useEventDetails from 'hooks/eventHooks/useEventDetails';
import { purchaseRequest } from 'services/transactionService';
import './CartDropdown.css';

const CartDropdown = ({ isVisible, toggleVisibility }) => {
  const { cart, removeFromCart } = useContext(CartContext);
  const {
    totalPrice,
    loading: totalLoading,
    error: totalError,
  } = useCartTotal(cart);
  const {
    eventDetails,
    loading: eventLoading,
    error: eventError,
  } = useEventDetails(cart);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await purchaseRequest(cart);

      if (response.success) {
        setSuccessMessage('Zakup zakończony sukcesem!');
        cart.forEach((item) => removeFromCart(item.ticket_id));
      } else {
        setErrorMessage('Zakup nie powiódł się.');
      }
    } catch (error) {
      console.error('Błąd podczas zakupu:', error.message);
      setErrorMessage('Wystąpił błąd podczas przetwarzania zakupu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cart-dropdown ${isVisible ? 'visible' : ''}`}>
      <div className="cart-header">
        <h3>Koszyk</h3>
        <h4>({cart.length})</h4>
        <FaTimes className="close-icon" onClick={toggleVisibility}>
          ✕
        </FaTimes>
      </div>
      {cart.length === 0 ? (
        <p className="empty-cart-message">Twój koszyk jest pusty.</p>
      ) : (
        <div className="cart-items">
          {eventError && <p className="error-message">{eventError}</p>}
          {cart.map((item) => {
            const event = eventDetails[item.ticket_id];
            return (
              <div key={item.ticket_id} className="cart-item-section">
                <div className="ticket-details-row">
                  <span className="label">Wydarzenie:</span>
                  <span className="value">
                    {eventLoading
                      ? 'Ładowanie...'
                      : event?.title || 'Brak danych'}
                  </span>
                </div>
                <div className="ticket-details-row">
                  <span className="label">Miejsce:</span>
                  <span className="value">
                    {eventLoading
                      ? 'Ładowanie...'
                      : event?.seat_label || 'Brak danych'}
                  </span>
                </div>
                <div className="ticket-details-row">
                  <span className="label">Cena:</span>
                  <span className="value">
                    {eventLoading
                      ? 'Ładowanie...'
                      : event
                      ? `${event.price} zł`
                      : 'Brak danych'}
                  </span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.ticket_id)}
                >
                  Usuń z koszyka
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="cart-footer">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p>
          Łącznie:{' '}
          <b>{totalLoading ? 'Ładowanie...' : `${totalPrice.toFixed(2)} zł`}</b>
        </p>
        <Link
          className="view-cart-btn"
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? 'Przetwarzanie...' : 'Dokonaj zakupu'}
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;
