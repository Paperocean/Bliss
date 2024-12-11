import React, { useState, useEffect } from 'react';
import { fetchUsersTickets } from '../services/userService';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await fetchUsersTickets();
        if (response.success) {
          setTickets(response.tickets);
        } else {
          throw new Error(response.message || 'Failed to fetch tickets.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.ticket_id}>
              <strong>Event ID:</strong> {ticket.event_id} <br />
              <strong>Status:</strong> {ticket.status} <br />
              <strong>Seat:</strong> {ticket.seat_label || 'N/A'} <br />
              <strong>Price:</strong> ${ticket.price} <br />
              <strong>Purchase Time:</strong>{' '}
              {new Date(ticket.purchase_time).toLocaleString()} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTickets;
