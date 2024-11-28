const { calculateCart } = require('../../services/cartService');

exports.calculateSummary = async (req, res) => {
    try {
        const { cart } = req.body;

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
        }

        const cartSummary = await calculateCart(cart);
        res.json({ success: true, cartSummary });
    } catch (error) {
        console.error('Error during checkout:', error.message);
        res.status(500).json({ success: false, message: 'Server error during cart calculation.' });
    }
};
