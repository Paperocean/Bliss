const db = require('../../config/db');
const { generateTickets } = require('../../services/ticketService');

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
    res
      .status(500)
      .json({ success: false, message: 'Server error while fetching events' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM event_categories');
    res.status(200).json({ success: true, categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
    });
  }
};

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
      seat_prices,
    } = req.body;
    const organizer_id = req.user.user_id;

    if (!title || !location || !start_time || !end_time || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    if (has_numbered_seats) {
      if (!rows || !seats_per_row) {
        return res.status(400).json({
          success: false,
          message: 'Rows and seats per row are required for numbered seats.',
        });
      }

      const totalSeats = rows * seats_per_row;
      if (!seat_prices || Object.keys(seat_prices).length !== totalSeats) {
        return res.status(400).json({
          success: false,
          message: `All ${totalSeats} seat prices must be set.`,
        });
      }

      for (const [seatId, price] of Object.entries(seat_prices)) {
        if (typeof price !== 'number' || price < 0) {
          return res.status(400).json({
            success: false,
            message: `Price for seat ${seatId} is invalid. ${price}`,
          });
        }
      }
    } else {
      if (ticket_price === undefined || ticket_price === null) {
        return res.status(400).json({
          success: false,
          message:
            'Ticket price is required for events without numbered seats.',
        });
      }

      if (typeof ticket_price !== 'number' || ticket_price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Ticket price must be a valid non-negative number.',
        });
      }

      if (!capacity || typeof capacity !== 'number' || capacity < 1) {
        return res.status(400).json({
          success: false,
          message:
            'Valid capacity is required for events without numbered seats.',
        });
      }
    }

    const categoryResult = await db.query(
      'SELECT * FROM event_categories WHERE category_id = $1',
      [category_id]
    );
    if (categoryResult.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid category ID.' });
    }

    const calculatedCapacity = has_numbered_seats
      ? rows * seats_per_row
      : capacity;

    const eventResult = await db.query(
      `INSERT INTO events
           (title, organizer_id, description, location, category_id, start_time, end_time, capacity, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING *`,
      [
        title,
        organizer_id,
        description,
        location,
        category_id,
        start_time,
        end_time,
        calculatedCapacity,
      ]
    );

    const event = eventResult.rows[0];

    if (has_numbered_seats) {
      await generateTickets(
        event.event_id,
        rows,
        seats_per_row,
        has_numbered_seats,
        seat_prices
      );
    } else {
      await generateTickets(
        event.event_id,
        capacity,
        null,
        has_numbered_seats,
        { price: parseFloat(ticket_price) }
      );
    }

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Error creating event:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error while creating event.' });
  }
};
