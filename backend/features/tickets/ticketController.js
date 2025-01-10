const db = require('../../config/db');

exports.getAvailableSeats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await db.query(
      `SELECT ticket_id, seat_label, price
             FROM tickets
             WHERE event_id = $1 AND status = 'available'`,
      [eventId]
    );
    console.log('Fetched seats: ', result.rows);
    res.status(200).json({ success: true, seats: result.rows });
  } catch (error) {
    console.error('Error getting available seats:', error.message);
    res
      .status(500)
      .json({ success: false, message: 'Failed to get available seats' });
  }
};

exports.getEventByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId || isNaN(ticketId)) {
      return res.status(400).json({
        success: false,
        message: 'Nieprawidłowy identyfikator biletu. Podaj poprawne ID.',
      });
    }

    const parsedTicketId = parseInt(ticketId, 10);

    const result = await db.query(
      `SELECT e.event_id, e.title, e.description, e.location, e.start_time, e.end_time,
              t.seat_label, t.price
       FROM tickets t
       JOIN events e ON t.event_id = e.event_id
       WHERE t.ticket_id = $1`,
      [parsedTicketId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nie znaleziono wydarzenia dla tego biletu.',
      });
    }

    res.status(200).json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Błąd pobierania wydarzenia po bilecie:', error.message);
    res.status(500).json({
      success: false,
      message: 'Wystąpił problem podczas pobierania szczegółów wydarzenia.',
    });
  }
};


exports.refundTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId || isNaN(ticketId)) {
      return res.status(400).json({
        success: false,
        message: 'Nieprawidłowy identyfikator biletu.',
      });
    }

    const parsedTicketId = parseInt(ticketId, 10);

    const ticketCheck = await db.query(
      `SELECT t.ticket_id, t.price, t.user_id, tt.transaction_id
       FROM tickets t
       LEFT JOIN transaction_tickets tt ON t.ticket_id = tt.ticket_id
       WHERE t.ticket_id = $1 AND t.status = 'sold'`,
      [parsedTicketId]
    );

    if (ticketCheck.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nie znaleziono biletu do zwrotu lub bilet nie jest sprzedany.',
      });
    }

    const ticket = ticketCheck.rows[0];
    const { price, transaction_id, user_id } = ticket;

    if (!transaction_id) {
      return res.status(400).json({
        success: false,
        message: 'Brak powiązanej transakcji dla tego biletu.',
      });
    }

    await db.query('BEGIN');

    const refundTransaction = await db.query(
      `INSERT INTO transactions (buyer_id, amount, payment_status)
       VALUES ($1, $2, 'refunded')
       RETURNING transaction_id, transaction_time`,
      [user_id, -price] 
    );

    const refundTransactionId = refundTransaction.rows[0].transaction_id;

    await db.query(
      `INSERT INTO transaction_tickets (transaction_id, ticket_id)
       VALUES ($1, $2)`,
      [refundTransactionId, parsedTicketId]
    );

    await db.query(
      `UPDATE tickets 
       SET status = 'available', user_id = NULL, purchase_time = NULL 
       WHERE ticket_id = $1`,
      [parsedTicketId]
    );

    await db.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Bilet został pomyślnie zwrócony.',
      refundTransactionId,
    });
  } catch (error) {
    await db.query('ROLLBACK'); 
    console.error('Błąd zwrotu biletu:', error.message);
    res.status(500).json({
      success: false,
      message: 'Nie udało się zwrócić biletu.',
    });
  }
};
