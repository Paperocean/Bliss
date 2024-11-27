const db = require('../config/db');

exports.generateTickets = async (eventId, rows, seatsPerRow, hasNumberedSeats, ticketPrice) => {
    try {
        const tickets = [];

        if (hasNumberedSeats) {
            for (let row = 1; row <= rows; row++) {
                for (let seat = 1; seat <= seatsPerRow; seat++) {
                    tickets.push([eventId, null, ticketPrice, 'available', `Row ${row} Seat ${seat}`]);
                }
            }
        } else {
            for (let i = 0; i < rows * seatsPerRow; i++) {
                tickets.push([eventId, null, ticketPrice, 'available', null]);
            }
        }

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
