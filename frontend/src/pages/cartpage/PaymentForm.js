import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const PaymentForm = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePayment = () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // Simulate payment API call
        setTimeout(() => {
            const isSuccess = Math.random() > 0.5;
            setPaymentStatus(isSuccess ? 'success' : 'failure');
            if (isSuccess) clearCart();
        }, 1000);
    };

    return (
        <div>
            <h1>Payment</h1>
            <button onClick={handlePayment}>Pay Now</button>
            {paymentStatus && <p>Payment {paymentStatus === 'success' ? 'Successful!' : 'Failed.'}</p>}
        </div>
    );
};

export default PaymentForm;
