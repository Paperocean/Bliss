const db = require('../../config/db');

exports.calculateCart = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data. Please provide a valid cart.',
      });
    }

    const ticketIds = cart.map((item) => item.ticket_id);

    const ticketQuery = `
      SELECT t.ticket_id, t.price, t.status, e.title, t.seat_label
      FROM tickets t
      JOIN events e ON t.event_id = e.event_id
      WHERE t.ticket_id = ANY($1) AND t.status = 'available';
    `;

    const { rows: ticketDetails } = await db.query(ticketQuery, [ticketIds]);

    let totalPrice = 0;
    const ticketInfoMap = {};

    ticketDetails.forEach((ticket) => {
      totalPrice += parseFloat(ticket.price);
      ticketInfoMap[ticket.ticket_id] = ticket;
    });

    const invalidTickets = cart.filter(
      (item) => !ticketInfoMap[item.ticket_id]
    );
    if (invalidTickets.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following tickets are invalid or unavailable: ${invalidTickets
          .map((item) => item.ticket_id)
          .join(', ')}`,
      });
    }

    res.status(200).json({
      success: true,
      totalPrice,
      tickets: ticketInfoMap,
    });
  } catch (error) {
    console.error('Error calculating cart:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while calculating the cart.',
    });
  }
};
