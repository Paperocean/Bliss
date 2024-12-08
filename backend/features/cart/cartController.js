const { calculateCart, applyDiscountCode, finalizePurchase } = require('../../services/cartService');

exports.checkout = async (req, res) => {
    try {
        const { cart, discountCode } = req.body;

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
        }

        const totalAmount = await calculateCart(cart, discountCode);

        const purchaseResult = await finalizePurchase(cart);

        if (purchaseResult.success) {
            return res.json({
                success: true,
                message: 'Purchase successful, tickets marked as sold.',
                totalAmount: totalAmount,
                cartSummary: {
                    totalAmount: totalAmount,
                    soldTickets: cart.map(item => item.ticket_id)
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to finalize the purchase. Some tickets are no longer available.'
            });
        }
    } catch (error) {
        console.error('Error during checkout:', error.message);
        res.status(500).json({ success: false, message: 'Server error during cart calculation.' });
    }
};

exports.applyDiscount = async (req, res) => {
    try {
        const { cart, discountCode } = req.body;
        const updatedCart = await applyDiscountCode(cart, discountCode);

        res.json({ success: true, cartSummary: updatedCart });
    } catch (error) {
        console.error('Error applying discount:', error.message);
        res.status(500).json({ success: false, message: 'Error applying discount.' });
    }
};
