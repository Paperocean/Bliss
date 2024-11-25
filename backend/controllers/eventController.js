const pool = require('../config/db');
const { validateEventInput } = require('../utils/validateInput');

exports.createEvent = async (req, res) => {
    try {
        validateEventInput(req.body);

        const { name, description, location, event_date, category } = req.body;

        // Ensure the category is included
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }

        const result = await pool.query(
            `INSERT INTO public.events 
             (name, description, location, event_date, category) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, description, location, event_date, category]
        );

        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ success: false, message: error.message || 'Invalid input' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        // Sprawdzamy, czy parametr 'category' został podany w zapytaniu
        const category = req.query.category;

        // Jeśli parametr 'category' nie został podany, zwróć wszystkie kategorie
        let query = 'SELECT DISTINCT category FROM public.events';
        
        // Jeśli parametr 'category' jest obecny, filtrujemy po tej kategorii
        if (category) {
            query += ' WHERE category = $1';
        }

        // Wykonujemy zapytanie
        const result = await pool.query(query, category ? [category] : []);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }

        // Zwracamy wynik w formacie JSON
        res.status(200).json({ success: true, categories: result.rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};