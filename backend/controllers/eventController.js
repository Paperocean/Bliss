const pool = require('../config/db');
const { validateEventInput } = require('../utils/validateInput');

exports.createEvent = async (req, res) => {
    try {
        validateEventInput(req.body);

        const { name, description, location, event_date } = req.body;

        const result = await pool.query(
            'INSERT INTO public.events (name, description, location, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, location, event_date]
        );

        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ success: false, message: error.message || 'Invalid input' });
    }
};