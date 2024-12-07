const { calculateCart } = require('../../services/cartService');

exports.calculateSummary = async (req, res) => {
    try {
        // Otrzymanie danych koszyka z ciała zapytania
        const { cart } = req.body;

        // Walidacja: Koszyk nie może być pusty
        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
        }

        // Obliczenie podsumowania koszyka
        const cartSummary = await calculateCart(cart);

        // Zwrócenie obliczonego podsumowania
        res.json({ success: true, cartSummary });
    } catch (error) {
        // Logowanie błędu
        console.error('Error during checkout:', error.message);

        // Obsługa błędu serwera
        res.status(500).json({ success: false, message: 'Server error during cart calculation.' });
    }
};
