const db = require('../config/db');

exports.calculateCart = async (userId, cart) => {
    let totalPrice = 0;

    for (const item of cart) {
        const event = await db.query('SELECT event_id, capacity FROM events WHERE event_id = $1', [item.event_id]);
        if (event.rowCount.length == 0) {
            throw new Error(`Event with id ${item.event_id} not found`);
        }
        const ticket = await db.query('SELECT price FROM tickets WHERE event_id = $1 AND status = $2 LIMIT 1', [item.event_id, 'available']);
        if (event.rowCount.length == 0) {
            throw new Error(`No available tickets for event ${item.event_id}.`);
        }

        const ticketPrice = ticket.rows[0].price * item.quantity;
        totalPrice += ticketPrice;
    }

    return totalPrice;
}