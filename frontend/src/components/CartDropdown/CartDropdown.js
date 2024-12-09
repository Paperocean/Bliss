import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from 'context/CartContext';
import { fetchEventByTicket } from 'services/ticketService';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; 
import './CartDropdown.css';

const CartDropdown = ({ isVisible, toggleVisibility }) => {
    const { cart, removeFromCart } = useContext(CartContext);
    const [eventDetails, setEventDetails] = useState({});

    useEffect(() => {
        const loadEventDetails = async () => {
            const details = {};
            for (const item of cart) {
                if (!eventDetails[item.ticket_id]) {
                    const data = await fetchEventByTicket(item.ticket_id);
                    details[item.ticket_id] = data;
                }
            }
            setEventDetails((prevDetails) => ({ ...prevDetails, ...details }));
        };

        if (cart.length > 0) {
            loadEventDetails();
        }
    }, [cart]);

    return (
        <div className={`cart-dropdown ${isVisible ? 'visible' : ''}`}>
            <div className="cart-header">
                <h3>Koszyk</h3>
                <h4>({cart.length})</h4>
                <FaTimes className="close-icon" onClick={toggleVisibility}>✕</FaTimes>
            </div>
            {cart.length === 0 ? (
                <p className="empty-cart-message">Twój koszyk jest pusty.</p>
            ) : (
                <div className="cart-items">
                    {cart.map((item) => {
                        const event = eventDetails[item.ticket_id];
                        return (
                            <div key={item.ticket_id} className="cart-item-section">
                                <div className="ticket-details-row">
                                    <span className="label">Wydarzenie:</span>
                                    <span className="value">{event ? event.title : 'Loading...'}</span>
                                </div>
                                <div className="ticket-details-row">
                                    <span className="label">Miejsce:</span>
                                    <span className="value">{event ? event.seat_label : 'Loading...'}</span>
                                </div>
                                <div className="ticket-details-row">
                                    <span className="label">Cena:</span>
                                    <span className="value">{event ? `$${event.price}` : 'Loading...'}</span>
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
                <Link to="/cart" className="view-cart-btn" onClick={toggleVisibility}>
                    Dokonaj zakupu
                </Link>
            </div>
        </div>
    );
};

export default CartDropdown;