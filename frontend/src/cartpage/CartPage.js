import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the token from localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            setErrorMessage('You must log in to view your cart.');
            navigate('/login');
            return;
        }

        // Fetch the cart data for the logged-in user
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data.cartItems || []);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to load cart items.');
                }
            } catch (error) {
                setErrorMessage('Error loading cart: ' + error.message);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
    const taxPrice = itemsPrice * 0.14;
    const shippingPrice = itemsPrice > 2000 ? 0 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const handleAdd = async (item) => {
        // Logic to add an item to the cart
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: item.id }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCartItems(updatedCart.cartItems);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to add item.');
            }
        } catch (error) {
            setErrorMessage('Error adding item: ' + error.message);
        }
    };

    const handleRemove = async (item) => {
        // Logic to remove an item from the cart
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/cart/remove', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: item.id }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCartItems(updatedCart.cartItems);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to remove item.');
            }
        } catch (error) {
            setErrorMessage('Error removing item: ' + error.message);
        }
    };

    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1>Shopping Cart</h1>
            </header>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <section className="cart-items">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is currently empty.</p>
                        <Link to="/" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-details">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                    <Link to={`/product/${item.id}`} className="item-name">
                                        {item.name}
                                    </Link>
                                    <div className="item-price">
                                        {item.qty} x ${item.price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button className="action-btn" onClick={() => handleAdd(item)}>+</button>
                                <button className="action-btn" onClick={() => handleRemove(item)}>-</button>
                            </div>
                        </div>
                    ))
                )}
            </section>
            {cartItems.length > 0 && (
                <section className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-item">
                        <span>Items Price:</span>
                        <span>${itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Tax Price:</span>
                        <span>${taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Shipping Price:</span>
                        <span>${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item total-price">
                        <strong>Total Price:</strong>
                        <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                    <div className="checkout-button">
                        <button
                            className="checkout-btn"
                            onClick={() => alert('Proceeding to Checkout')}
                        >
                            Checkout
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default CartPage;
