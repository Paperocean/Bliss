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
        console.error('Error fetching available seats:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch available seats' });
    }
};

exports.fetchEventByTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const result = await db.query(
            `SELECT e.event_id, e.title, e.description, e.location, e.start_time, e.end_time, 
                    t.seat_label, t.price
             FROM tickets t
             JOIN events e ON t.event_id = e.event_id
             WHERE t.ticket_id = $1`,
            [ticketId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Event not found for this ticket.' });
        }

        res.status(200).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error('Error fetching event by ticket:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch event details' });
    }
};


