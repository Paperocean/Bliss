import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { fetchEventByTicket } from '../../services/ticketService';

const CartPage = () => {
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
        
        loadEventDetails();
        // eslint-disable-next-line
    }, [cart]);

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item) => {
                        const event = eventDetails[item.ticket_id];
                        return (
                            <li key={item.ticket_id}>
                                <h3>{event ? event.title : 'Loading...'}</h3>
                                <p>Seat: {event ? event.seat_label : 'Loading...'}</p>
                                <p>Price: {event ? `$${event.price}` : 'Loading...'}</p>
                                <button onClick={() => removeFromCart(item.ticket_id)}>Remove</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CartPage;
