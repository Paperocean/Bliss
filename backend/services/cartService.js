const db = require('../config/db');

exports.calculateCart = async (cart) => {
    const ticketIds = cart.map((item) => item.ticket_id);

    if (ticketIds.length === 0) {
        return 0; 
    }

    const ticketQuery = `
        SELECT SUM(t.price) AS total_price
        FROM tickets t
        WHERE t.ticket_id = ANY($1) AND t.status = 'available'
    `;

    const result = await db.query(ticketQuery, [ticketIds]);

    return result.rows[0].total_price || 0; 
};
