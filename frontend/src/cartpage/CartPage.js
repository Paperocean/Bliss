import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const CartPage = ({ cartItems, onAdd, onRemove }) => {
    const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
    const taxPrice = itemsPrice * 0.14;
    const shippingPrice = itemsPrice > 2000 ? 0 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {cartItems.length === 0 && <div>Cart is empty</div>}
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div className="item-details">
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                                <div>
                                    {item.qty} x ${item.price.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => onAdd(item)}>+</button>
                            <button onClick={() => onRemove(item)}>-</button>
                        </div>
                    </div>
                ))}
            </div>
            {cartItems.length !== 0 && (
                <div className="cart-summary">
                    <div className="summary-item">
                        <div>Items Price</div>
                        <div>${itemsPrice.toFixed(2)}</div>
                    </div>
                    <div className="summary-item">
                        <div>Tax Price</div>
                        <div>${taxPrice.toFixed(2)}</div>
                    </div>
                    <div className="summary-item">
                        <div>Shipping Price</div>
                        <div>${shippingPrice.toFixed(2)}</div>
                    </div>
                    <div className="summary-item">
                        <div>Total Price</div>
                        <div>${totalPrice.toFixed(2)}</div>
                    </div>
                    <div className="checkout-button">
                        <button onClick={() => alert('Proceed to Checkout')}>Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;