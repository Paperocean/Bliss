import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { calculateCart } from '../services/cartService';
import './CartPage.css';

const CartPage = () => {
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const [summary, setSummary] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCheckout = async () => {
        try {
            const data = await calculateCart(cart);
            setSummary(data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {cart.length === 0 ? (
                <div>
                    <p>Your cart is empty.</p>
                    <Link to="/event" className="btn-primary">Browse Events</Link>
                </div>
            ) : (
                <div>
                    <section className="cart-items">
                        {cart.map((item) => (
                            <div key={item.event_id} className="cart-item">
                                <h3>{item.name}</h3>
                                <p>Quantity: {item.quantity}</p>
                                <button className="btn" onClick={() => addToCart(item, 1)}>+</button>
                                <button className="btn" onClick={() => removeFromCart(item.event_id)}>-</button>
                            </div>
                        ))}
                    </section>
                    <button className="btn-primary" onClick={handleCheckout}>
                        Calculate Total
                    </button>
                    {summary && (
                        <section className="cart-summary">
                            <h2>Order Summary</h2>
                            <p>Items Price: ${summary.totalPrice.toFixed(2)}</p>
                            <p>Tax Price: ${summary.taxPrice.toFixed(2)}</p>
                            <p>Shipping Price: ${summary.shippingPrice.toFixed(2)}</p>
                            <p><strong>Total Price: ${summary.finalPrice.toFixed(2)}</strong></p>
                            <button className="btn-primary">
                                Purchase
                            </button>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartPage;
