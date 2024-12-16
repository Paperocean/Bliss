const db = require('../../config/db');

exports.purchase = async (req, res) => {
  const client = await db.connect();
  try {
    const userId = req.user.user_id;
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty or invalid.',
      });
    }

    await client.query('BEGIN');

    const ticketIds = cart.map((item) => item.ticket_id);

    const ticketQuery = `
      SELECT ticket_id, event_id, price, status
      FROM tickets
      WHERE ticket_id = ANY($1) AND status = 'available';
    `;
    const { rows: availableTickets } = await client.query(ticketQuery, [
      ticketIds,
    ]);

    if (availableTickets.length !== cart.length) {
      const unavailableIds = ticketIds.filter(
        (id) => !availableTickets.find((ticket) => ticket.ticket_id === id)
      );
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `The following tickets are unavailable: ${unavailableIds.join(
          ', '
        )}`,
      });
    }

    const transactions = [];
    const updatedTickets = [];

    for (const ticket of availableTickets) {
      const { ticket_id: ticketId, event_id: eventId, price } = ticket;

      const transactionQuery = `
        INSERT INTO transactions (ticket_id, buyer_id, event_id, amount, payment_status)
        VALUES ($1, $2, $3, $4, 'completed')
        RETURNING transaction_id, transaction_time;
      `;
      const { rows: transaction } = await client.query(transactionQuery, [
        ticketId,
        userId,
        eventId,
        price,
      ]);
      transactions.push(transaction[0]);

      const updateTicketQuery = `
        UPDATE tickets
        SET status = 'sold', user_id = $1, purchase_time = CURRENT_TIMESTAMP
        WHERE ticket_id = $2
        RETURNING ticket_id, status, user_id, purchase_time;
      `;
      const { rows: updatedTicket } = await client.query(updateTicketQuery, [
        userId,
        ticketId,
      ]);
      updatedTickets.push(updatedTicket[0]);
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Cart purchased successfully.',
      transactions,
      tickets: updatedTickets,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing cart purchase:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process cart purchase.',
    });
  } finally {
    client.release();
  }
};
