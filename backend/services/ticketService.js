// backend/features/events/services/ticketService.js

const db = require('../config/db');

exports.generateTickets = async (
  eventId,
  rowsOrCapacity,
  seatsPerRow,
  hasNumberedSeats,
  priceInfo
) => {
  try {
    const tickets = [];

    if (hasNumberedSeats) {
      const rows = rowsOrCapacity; // Represents number of rows
      const seatsPerRowVal = seatsPerRow; // Number of seats per row

      // Generate seat labels and create tickets with individual prices
      for (let row = 1; row <= rows; row++) {
        const rowLabel = String.fromCharCode(64 + row); // 'A', 'B', etc.
        for (let seat = 1; seat <= seatsPerRowVal; seat++) {
          const seatId = `${rowLabel}${seat}`; // e.g., 'A1', 'B2'
          const price = priceInfo[seatId];

          // Price validation should have been done in the controller
          // Here, we can assume price is valid

          tickets.push([
            eventId,
            null, // user_id initially null
            price,
            'available',
            seatId, // seat_label
          ]);
        }
      }
    } else {
      const capacity = rowsOrCapacity; // Represents capacity
      const price = priceInfo.price; // Uniform price for all tickets

      // Price validation should have been done in the controller
      // Here, we can assume price is valid

      for (let i = 0; i < capacity; i++) {
        tickets.push([
          eventId,
          null, // user_id initially null
          price,
          'available',
          'N/A', // seat_label
        ]);
      }
    }

    // Prepare bulk insertion with parameterized queries
    const values = [];
    const placeholders = tickets
      .map((_, idx) => {
        const baseIdx = idx * 5;
        values.push(
          tickets[idx][0], // event_id
          tickets[idx][1], // user_id
          tickets[idx][2], // price
          tickets[idx][3], // status
          tickets[idx][4] // seat_label
        );
        return `($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${
          baseIdx + 4
        }, $${baseIdx + 5})`;
      })
      .join(', ');

    const query = `
      INSERT INTO tickets (event_id, user_id, price, status, seat_label)
      VALUES ${placeholders};
    `;

    await db.query(query, values);
  } catch (error) {
    console.error('Error generating tickets:', error);
    throw new Error('Failed to generate tickets.');
  }
};
