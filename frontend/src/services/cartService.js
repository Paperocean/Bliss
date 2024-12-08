import apiRequest from "../utils/apiRequest";

export const checkout = async (cart) => {
    try {
        // Wysyłamy dane koszyka do backendu w celu obliczenia sumy oraz przetworzenia zakupu
        const response = await apiRequest('/cart/checkout', 'POST', { cart });

        if (response.success) {
            return {
                success: true,
                cartSummary: response.cartSummary  // Zwracamy szczegóły podsumowania koszyka
            };
        } else {
            return {
                success: false,
                message: response.message || 'An error occurred during checkout.'
            };
        }
    } catch (error) {
        console.error('Error during checkout:', error.message);
        throw new Error('Error during checkout');
    }
};

// Funkcja obsługująca rabat
export const applyDiscount = async (cart, discountCode) => {
    try {
        const response = await apiRequest('/cart/applyDiscount', 'POST', { cart, discountCode });

        if (response.success) {
            return response.cartSummary;  // Zwracamy zaktualizowane podsumowanie koszyka
        } else {
            throw new Error(response.message || 'Failed to apply discount');
        }
    } catch (error) {
        console.error('Error applying discount:', error.message);
        throw new Error('Error applying discount');
    }
};