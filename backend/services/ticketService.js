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
      const rows = rowsOrCapacity;
      const seatsPerRowVal = seatsPerRow;

      for (let row = 1; row <= rows; row++) {
        const rowLabel = String.fromCharCode(64 + row);
        for (let seat = 1; seat <= seatsPerRowVal; seat++) {
          const seatId = `${rowLabel}${seat}`;
          const price = priceInfo[seatId];

          tickets.push([eventId, null, price, 'available', seatId]);
        }
      }
    } else {
      const capacity = rowsOrCapacity;
      const price = priceInfo.price;

      for (let i = 0; i < capacity; i++) {
        tickets.push([eventId, null, price, 'available', 'Miejsce Stojące']);
      }
    }

    const values = [];
    const placeholders = tickets
      .map((_, idx) => {
        const baseIdx = idx * 5;
        values.push(
          tickets[idx][0],
          tickets[idx][1],
          tickets[idx][2],
          tickets[idx][3],
          tickets[idx][4]
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
