const { calculateCart } = require('../../services/cartService');

exports.checkout = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { cart } = req.body;

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
        }

        const cartSummary = await calculateCart(userId, cart);
        res.json({ success: true, cartSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during cart calculation' });
    }
};
