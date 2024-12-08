import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { applyDiscount, checkout } from '../../services/cartService';

const CartPage = () => {
    const { cart, removeFromCart, clearCart, updateCartWithAvailableSeats } = useContext(CartContext);
    const [cartSummary, setCartSummary] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
    
        alert('Proceeding to checkout...');
    
        try {
            const response = await checkout(cart); // Wywołanie funkcji checkout z koszykiem
            console.log('Server response:', response); // Logowanie odpowiedzi z serwera
    
            if (response.success && response.cartSummary) {
                setCartSummary(response.cartSummary);
    
                // Sprawdzamy, czy totalAmount jest obiektem
                let totalAmount = response.cartSummary.totalAmount;
    
                // Jeśli totalAmount to obiekt, uzyskaj właściwą wartość
                if (typeof totalAmount === 'object' && totalAmount.totalAmount !== undefined) {
                    totalAmount = totalAmount.totalAmount; // Uzyskujemy liczbę z obiektu
                }

                // Konwertowanie totalAmount na liczbę i sprawdzenie, czy to liczba
                totalAmount = parseFloat(totalAmount);

                if (!isNaN(totalAmount)) {
                    setTotalAmount(totalAmount); // Ustawienie nowej wartości totalAmount
                    alert(`Total amount: $${totalAmount.toFixed(2)}`); // Wyświetlanie kwoty z 2 miejscami po przecinku
                } else {
                    console.error('Invalid total amount received:', response.cartSummary.totalAmount);
                    alert('Error: Invalid total amount received');
                    return;
                }

                // Aktualizacja koszyka z biletami, które zostały sprzedane (usunięcie z koszyka)
                updateCartWithAvailableSeats(response.cartSummary.soldTickets);

                // Czyszczenie koszyka po dokonaniu zakupu
                clearCart();
                } else {
                    alert(response.message || 'Payment failed.');
                }
                } catch (error) {
                    console.error('Error calculating cart summary:', error.message);
                    alert('Error calculating cart summary');
                }
                };

    const handleApplyDiscount = async () => {
        try {
            const updatedSummary = await applyDiscount(cart, discountCode);
            setCartSummary(updatedSummary);

            const totalAmount = parseFloat(updatedSummary.totalAmount);
            if (!isNaN(totalAmount)) {
                setTotalAmount(totalAmount);
                alert(`Discount applied! New total: $${totalAmount.toFixed(2)}`);
            } else {
                alert('Error: Invalid total amount after discount');
            }
        } catch (error) {
            alert(`Error applying discount: ${error.message}`);
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
                        <li key={item.ticket_id}>
                            <span>{item.seat_label} - ${item.price}</span>
                            <button onClick={() => removeFromCart(item.ticket_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Wyświetlanie ceny koszyka osobno */}
            <div>
                <h2>Cart Total</h2>
                <p>Total Amount: ${totalAmount.toFixed(2)}</p> {/* Wyświetlanie całkowitej ceny */}
            </div>

            {/* Dodanie sekcji rabatu */}
            {/* <div>
                <input
                    type="text"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button onClick={handleApplyDiscount}>Apply Discount</button>
            </div> */}

            {/* Podsumowanie koszyka */}
            {cartSummary && (
                <div>
                    <h2>Cart Summary</h2>
                    <p>
                        Total Amount (after discount): $
                        {(() => {
                            // Sprawdzamy, czy totalAmount jest obiektem, a jeśli tak, wyciągamy liczbę
                            const totalAmount = typeof cartSummary.totalAmount === 'object' 
                                ? cartSummary.totalAmount.totalAmount 
                                : cartSummary.totalAmount;

                            // Upewniamy się, że totalAmount jest liczbą i wyświetlamy ją z dwoma miejscami po przecinku
                            return !isNaN(totalAmount) ? totalAmount.toFixed(2) : 'Invalid amount';
                        })()}
                    </p>
                </div>
            )}


            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
    );
};

export default CartPage;
