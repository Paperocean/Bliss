const db = require('../config/db');

exports.generateTickets = async (eventId, seatPrices) => {
    try {
        const tickets = Object.entries(seatPrices).map(([seatLabel, { price }]) => [
            eventId,
            null,
            price,
            'available',
            seatLabel,
        ]);

        const ticketValues = tickets.map(
            (ticket) => `(${ticket.map((value) => (value ? `'${value}'` : 'NULL')).join(', ')})`
        ).join(', ');

        const query = `
            INSERT INTO tickets (event_id, user_id, price, status, seat_label) 
            VALUES ${ticketValues};
        `;
        await db.query(query);
    } catch (error) {
        console.error('Error generating tickets:', error);
        throw new Error('Failed to generate tickets');
    }
};

