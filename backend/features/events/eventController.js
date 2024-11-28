const db = require('../../config/db');
const { generateTickets } = require('../../services/ticketService');

exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            start_time,
            end_time,
            capacity,
            category_id, 
            rows,
            seats_per_row,
            has_numbered_seats,
            ticket_price,
        } = req.body;

        const categoryResult = await db.query('SELECT * FROM event_categories WHERE category_id = $1', [category_id]);
        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }

        const eventResult = await db.query(
            `INSERT INTO events
             (title, description, location, start_time, end_time, capacity, category_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [title, description, location, start_time, end_time, capacity, category_id]
        );

        const event = eventResult.rows[0];

        await generateTickets(event.event_id, rows, seats_per_row, has_numbered_seats, ticket_price);

        res.status(201).json({ success: true, event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Failed to create event' });
    }
};


exports.getEvents = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                e.event_id, e.title, e.description, e.location, e.start_time, e.end_time, 
                c.name AS category, 
                COUNT(t.ticket_id) FILTER (WHERE t.status = 'available') AS available_tickets
            FROM events e
            LEFT JOIN tickets t ON e.event_id = t.event_id
            LEFT JOIN event_categories c ON e.category_id = c.category_id
            GROUP BY e.event_id, c.name
        `);

        res.status(200).json({ success: true, events: result.rows });
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ success: false, message: 'Server error while fetching events' });
    }
};


exports.getCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM event_categories');
        res.status(200).json({ success: true, categories: result.rows });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
};

exports.getEventsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const categoryQuery = `SELECT category_id FROM event_categories WHERE name = $1`;
        const categoryResult = await db.query(categoryQuery, [category]);

        if (categoryResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const categoryId = categoryResult.rows[0].category_id;

        const eventsQuery = `
            SELECT e.event_id AS id, e.title AS name, e.description, e.location, e.start_time AS event_date
            FROM events e
            WHERE e.category_id = $1
        `;
        const eventsResult = await db.query(eventsQuery, [categoryId]);

        res.status(200).json({
            success: true,
            events: eventsResult.rows,
        });
    } catch (error) {
        console.error('Error fetching events by category:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};