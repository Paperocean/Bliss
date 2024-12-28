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

exports.getEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    const query = `
      SELECT 
        e.event_id,
        e.title,
        e.description,
        e.location,
        ec.name AS category_name,
        e.start_time,
        e.end_time,
        e.capacity,
        e.has_numbered_seats,
        e.rows,
        e.seats_per_row,
        e.image,
        e.created_at,
        e.updated_at
      FROM 
        events e
      LEFT JOIN 
        event_categories ec ON e.category_id = ec.category_id
      WHERE 
        e.event_id = $1;
    `;

    const result = await db.query(query, [event_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${event_id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error getting event: ', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while getting the event.',
    });
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
      [parseFloat(category_id)]
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
        parseFloat(category_id),
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

exports.getOrganizerEvents = async (req, res) => {
  try{
    const organizer_id = req.user.user_id;
    const events = await db.query(
      `SELECT * FROM events WHERE organizer_id = $1 ORDER BY created_at DESC`,
      [organizer_id]
    );
    res.status(200).json({ success: true, events: events.rows });
    } catch (error) {
      console.error('Error fetching events:', error);
      res
        .status(500)
        .json({ success: false, message: 'Server error while fetching events.' });
    }
};

// Edycja wydarzenia
exports.editEvent = async (req, res) => {
  try {
      const { title, description, location, start_time, end_time, category_id } = req.body;
      const { eventId } = req.params;

      const result = await db.query(
          `UPDATE events
           SET title = $1, description = $2, location = $3, start_time = $4, end_time = $5, category_id = $6
           WHERE event_id = $7 RETURNING *`,
          [title, description, location, start_time, end_time, category_id, eventId]
      );

      res.json({ success: true, event: result.rows[0] });
  } catch (error) {
      console.error('Error editing event:', error.message);
      res.status(500).json({ success: false, message: 'Failed to edit event.' });
  }
};

// Generowanie raportu sprzedaży
exports.getEventReport = async (req, res) => {
  try {
    const { eventId } = req.params;

    const query = `
      SELECT 
        e.event_id,
        e.title,
        e.start_time,
        e.location,
        COUNT(t.ticket_id) FILTER (WHERE t.status = 'sold') AS tickets_sold,
        COALESCE(SUM(t.price) FILTER (WHERE t.status = 'sold'), 0) AS total_revenue,
        COALESCE(JSON_AGG(
          JSON_BUILD_OBJECT('seat_label', t.seat_label, 'price', t.price)
        ) FILTER (WHERE t.status = 'sold'), '[]'::json) AS sold_tickets_details
      FROM events e
      LEFT JOIN tickets t ON e.event_id = t.event_id
      WHERE e.event_id = $1
      GROUP BY e.event_id;
    `;

    const { rows } = await db.query(query, [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or no sold tickets.'
      });
    }

    const eventData = rows[0];

    res.json({
      success: true,
      report: {
        event_id: eventData.event_id,
        title: eventData.title,
        start_time: eventData.start_time,
        location: eventData.location,
        tickets_sold: eventData.tickets_sold,
        total_revenue: eventData.total_revenue,
        sold_tickets_details: eventData.sold_tickets_details,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
};

// Aktualizacja eventu (np. dodanie opisu)
exports.updateEvent = async (req, res) => {
  try {
      const { description } = req.body;
      const { eventId } = req.params;

      const result = await db.query(
          `UPDATE events SET description = $1, updated_at = CURRENT_TIMESTAMP
           WHERE event_id = $2 RETURNING *`,
          [description, eventId]
      );

      res.json({ success: true, event: result.rows[0] });
  } catch (error) {
      console.error('Error updating event:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

exports.buyTicket = async (req, res) => {
  const { eventId } = req.params;
  const { selected_seats, quantity } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
  }

  try {
    // Pobierz szczegóły wydarzenia, aby sprawdzić czy ma numerowane miejsca
    const eventResult = await db.query(
      `SELECT event_id, capacity FROM events WHERE event_id = $1`,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    let purchasedTickets = [];

    if (Array.isArray(selected_seats) && selected_seats.length > 0) {
      // Wydarzenie z numerowanymi miejscami (selected_seats przekazane)
      const updateQuery = `
        UPDATE tickets
        SET status = 'sold', user_id = $1, purchase_time = NOW()
        WHERE event_id = $2
        AND seat_label = ANY($3)
        AND status = 'available'
        RETURNING *;
      `;
      const updateResult = await db.query(updateQuery, [userId, eventId, selected_seats]);

      if (updateResult.rows.length < selected_seats.length) {
        return res.status(400).json({
          success: false,
          message: 'Some of the selected seats are no longer available.',
          purchased: updateResult.rows,
        });
      }

      purchasedTickets = updateResult.rows;
    } else if (quantity && quantity > 0) {
      // Wydarzenie bez numerowanych miejsc (kupujemy "quantity" biletów)
      const updateQuery = `
        UPDATE tickets
        SET status = 'sold', user_id = $1, purchase_time = NOW()
        WHERE event_id = $2
        AND status = 'available'
        LIMIT $3
        RETURNING *;
      `;
      const updateResult = await db.query(updateQuery, [userId, eventId, quantity]);

      if (updateResult.rows.length < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Not enough tickets available.',
          purchased: updateResult.rows,
        });
      }

      purchasedTickets = updateResult.rows;
    } else {
      return res.status(400).json({ success: false, message: 'No seats or quantity specified.' });
    }

    // Tutaj dodajemy rekordy do tabeli transactions
    // Dla każdego zakupionego biletu tworzymy wpis w transactions
    const transactionValues = purchasedTickets.map(ticket => {
      return `(${ticket.ticket_id}, ${userId}, ${eventId}, 'completed', ${ticket.price})`;
    }).join(', ');

    const transactionQuery = `
      INSERT INTO transactions (ticket_id, buyer_id, event_id, payment_status, amount)
      VALUES ${transactionValues}
      RETURNING *;
    `;

    const transactionResult = await db.query(transactionQuery);

    return res.json({
      success: true,
      message: 'Tickets purchased successfully.',
      tickets: purchasedTickets,
      transactions: transactionResult.rows
    });
  } catch (error) {
    console.error('Error buying tickets:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to purchase tickets.' });
  }
};

exports.createEventWithTickets = async (req, res) => {
  try {
    const {
      organizer_id, title, description, location,
      start_time, end_time, capacity,
      category_id, has_numbered_seats, rows, seats_per_row, priceInfo
    } = req.body;

    // Najpierw utwórz wydarzenie w bazie
    const eventResult = await createEvent({
      organizer_id,
      title,
      description,
      location,
      start_time,
      end_time,
      capacity,
      category_id,
      has_numbered_seats,
      rows,
      seats_per_row
    });

    const eventId = eventResult.event_id;

    // Następnie wygeneruj bilety
    await ticketService.generateTickets(
      eventId,
      has_numbered_seats ? rows : capacity,
      has_numbered_seats ? seats_per_row : null,
      has_numbered_seats,
      priceInfo
    );

    res.json({ success: true, event: eventResult });
  } catch (error) {
    console.error('Error creating event with tickets:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create event and generate tickets.' });
  }
};