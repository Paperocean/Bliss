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

exports.getCategories = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }

        const result = await pool.query(
            'SELECT * FROM public.events WHERE category = $1',
            [category]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No events found for this category' });
        }

        res.status(200).json({ success: true, events: result.rows });
    } catch (error) {
        console.error('Error fetching events by category:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
