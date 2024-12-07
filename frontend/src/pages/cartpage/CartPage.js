import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import apiRequest from '../../utils/apiRequest';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [cartSummary, setCartSummary] = useState(null);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        alert('Proceeding to checkout...');

        try {
            const response = await apiRequest('/cart/calculateSummary', 'POST', { cart }, true);
            
            if (response.success) {
                setCartSummary(response.cartSummary);
                alert(`Total amount: $${response.cartSummary.totalAmount}`);
                clearCart();  // Clear the cart after successful payment
            } else {
                alert(response.message); // Błąd z backendu
            }
        } catch (error) {
            console.error('Error calculating cart summary:', error.message);
            alert('Error calculating cart summary');
        }
    };

    return (
        <div>
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item) => (
                        <li key={item.ticketId}>
                            <span>{item.label} - ${item.price}</span>
                            <button onClick={() => removeFromCart(item.ticketId)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={handleCheckout}>Proceed to Checkout</button>

            {cartSummary && (
                <div>
                    <h2>Cart Summary</h2>
                    <p>Total Amount: ${cartSummary.totalAmount}</p>
                </div>
            )}
        </div>
    );
};

export default CartPage;
