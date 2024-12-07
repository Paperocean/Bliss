import apiRequest from "../utils/apiRequest";

export const calculateCart = async (cart) => {
    return apiRequest('/cart/checkout', 'POST', { cart }, true);
};

export const processPayment = async (cart) => {
    try {
        // Wysyłamy zapytanie POST z danymi koszyka do backendu
        const response = await apiRequest('/cart/payment', 'POST', { cart }, true);
        
        // Sprawdzamy, czy odpowiedź wskazuje na sukces płatności
        if (response.success) {
            return { success: true, message: 'Payment successful!' };
        } else {
            return { success: false, message: response.message || 'Payment failed. Please try again.' };
        }
    } catch (error) {
        console.error('Payment error:', error);
        return { success: false, message: 'An error occurred during payment. Please try again.' };
    }
};