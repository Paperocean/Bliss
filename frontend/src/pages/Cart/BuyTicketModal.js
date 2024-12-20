import React, { useEffect, useState } from 'react';
import Modal from 'components/props/Modal/Modal';
import Button from 'components/props/Button/Button';
import SeatGrid from '../../hooks/useSeatPricing';
import { buyTicketRequest } from '../../services/eventService';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import { getAvailableSeatsRequest } from 'services/ticketService';

const BuyTicketModal = ({ isOpen, onClose, eventId, hasNumberedSeats }) => {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0); 
  const [errorMessage, setErrorMessage] = useState('');
  const seatPrices = availableSeats.map(seat => seat.price);

  useEffect(() => {
    if (isOpen && eventId) {
      getAvailableSeatsRequest(eventId)
        .then(res => res.json())
        .then(data => {
          setAvailableSeats(data.seats);
          setTicketPrice(data.price);
        })
        .catch(err => setErrorMessage('Nie udało się pobrać danych'));
    }
  }, [isOpen, eventId]);

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleBuy = async () => {
    try {
      const payload = hasNumberedSeats 
        ? { event_id: eventId, selected_seats: selectedSeats }
        : { event_id: eventId, quantity: ticketQuantity };

      const response = await buyTicketRequest(payload);
      if (response.success) {
        // zakończ zakup
        onClose();
      } else {
        setErrorMessage(response.message || 'Błąd przy zakupie biletów.');
      }
    } catch (error) {
      setErrorMessage('Błąd sieci.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Kup bilet</h2>
      <ErrorMessage message={errorMessage} />
      {hasNumberedSeats ? (
        <SeatGrid 
          rows={availableSeats.length}
          seatsPerRow={availableSeats.length > 0 ? availableSeats[0].seats_per_row : 0}
          seatPrices={seatPrices}
          onSeatClick={handleSeatSelect}
          selectedSeats={selectedSeats}
          mode="select" 
        />
      ) : (
        <div>
          <p>Cena za jeden bilet: {ticketPrice} zł</p>
          <input 
            type="number" 
            value={ticketQuantity} 
            onChange={e => setTicketQuantity(parseInt(e.target.value, 10) || 1)} 
            min="1"
          />
          <p>Łączna cena: {ticketQuantity * ticketPrice} zł</p>
        </div>
      )}
      <Button onClick={handleBuy}>Zatwierdź zakup</Button>
    </Modal>
  );
};

export default BuyTicketModal;
