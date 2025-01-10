import React, { useContext, useState } from 'react';
import { CartContext } from 'context/CartContext';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import useCartTotal from 'hooks/cartHooks/useCartTotal';
import useEventDetails from 'hooks/eventHooks/useEventDetails';
import { purchaseRequest } from 'services/transactionService';
import './CartDropdown.css';

const CartDropdown = ({ isVisible, toggleVisibility }) => {
  const { cart, removeFromCart, clearCart, cartMessage, setCartMessage } =
    useContext(CartContext);
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
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { transactionId, totalAmount } = await purchaseRequest(cart);

      setTransactionId(transactionId);
      setTotalAmount(totalAmount ? parseFloat(totalAmount) : 0);
      setCartMessage(`Zakup zakończony sukcesem!`);

      clearCart();
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
        <h3 className="cart-title">🛒 Koszyk</h3>
        <span className="cart-count">({cart.length})</span>
        <FaTimes className="close-icon" onClick={toggleVisibility} />
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
        {errorMessage && (
          <div className="error-message">
            {errorMessage.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {cartMessage && (
          <div className="success-message">
            <p>{cartMessage}</p>
            {transactionId && (
              <p>
                <b>ID transakcji:</b> {transactionId}
              </p>
            )}
            {totalAmount !== null && (
              <p>
                <b>Cena transakcji:</b> {Number(totalAmount).toFixed(2)} zł
              </p>
            )}
            <p>
              <Link to={`/profile`}>Przejdź do profilu</Link>
            </p>
          </div>
        )}

        {cart.length > 0 && totalPrice > 0 && (
          <p>
            {totalError && <p className="error-message">{totalError}</p>}
            <b>
              <b>Łącznie:</b>{' '}
              {totalLoading
                ? 'Ładowanie...'
                : `${parseFloat(totalPrice).toFixed(2)} zł`}
            </b>
          </p>
        )}

        {totalPrice > 0 && (
          <Link onClick={handlePurchase}>
            {loading ? 'Przetwarzanie...' : 'Dokonaj zakupu'}
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
