import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useEvent from 'hooks/eventHooks/useEvent';
import useAvailableSeats from 'hooks/eventHooks/useAvailableSeats';
import useCart from 'hooks/cartHooks/useCart';

import basicCover from 'assets/basic_cover.webp';
import './Event.css';

import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import Button from 'components/props/Button/Button';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';

import SeatMapUser from 'components/SeatMap/SeatMapUser';

const formatDate = (isoString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(isoString).toLocaleDateString('pl-PL', options);
};

function EventPage() {
  const { event_id } = useParams();
  const { cart, addSeatToCart, error: cartError } = useCart();

  const {
    event,
    loading: eventLoading,
    error: eventError,
  } = useEvent(event_id);

  const {
    seats,
    loading: seatsLoading,
    error: seatsError,
  } = useAvailableSeats(event_id);

  useEffect(() => {
    document.title = event?.title ? `${event.title}` : 'Ładowanie wydarzenia...';
  }, [event]);


  const handleSeatSelect = (seatData) => {
    if (!seatData || !seatData.ticket_id) {
      alert('Nieprawidłowe dane biletu.');
      return;
    }

    if (cart.some((item) => item.ticket_id === seatData.ticket_id)) {
      alert('To miejsce jest już w koszyku.');
      return;
    }

    console.log('Dodano miejsce:', seatData);
    addSeatToCart(seatData);
  };

  const handleBuyNonNumbered = () => {
    if (!seats || seats.length === 0) {
      alert('Brak dostępnych miejsc dla tego wydarzenia.');
      return;
    }

    const seatsNotInCart = seats.filter(
      (seat) => !cart.some((item) => item.ticket_id === seat.ticket_id)
    );

    if (seatsNotInCart.length === 0) {
      alert('Wszystkie bilety są już w koszyku.');
      return;
    }

    const nextSeat = seatsNotInCart[0];

    console.log('Dodano nienumerowany bilet:', nextSeat);
    addSeatToCart(nextSeat);
  };

  if (eventLoading || seatsLoading) {
    return <div className="loading">Ładowanie...</div>;
  }

  if (eventError || seatsError) {
    return <div className="error">{eventError || seatsError}</div>;
  }

  const { rows, seats_per_row, has_numbered_seats, title } = event;

  const cheapestPrice =
    seats.length > 0
      ? Math.min(...seats.map((seat) => parseFloat(seat.price)))
      : null;

  return (
    <ContentWrapper>
      <div className="event-page">
        <div className="event-main-content">
          <div className="event-left-column">
            <div className="event-image">
              <img
                src={event.image || basicCover}
                alt={`Event: ${title}`}
                className="event-img"
              />
            </div>
            <h1 className="event-title">{event.title}</h1>
            <div className="event-loc-date">
              {event.location},<br />
              {'od '}
              {formatDate(event.start_time)}
              {' do '}
              {formatDate(event.end_time)}
            </div>
            <div className="category-badge">
              {event.category_name || 'General'}
            </div>
          </div>

          <div className="event-right-column">
            <h2>Opis wydarzenia</h2>
            <p>{event.description}</p>

            {has_numbered_seats && rows && seats_per_row ? (
              <>
                <h2>Wybierz miejsce</h2>
                <p>
                  Ceny biletów zaczynają się już od <b>{cheapestPrice} zł</b>.
                  Kliknij miejsce na mapce, aby dodać do koszyka.
                </p>
                <SeatMapUser
                  event={event}
                  seats={seats}
                  onSeatSelect={handleSeatSelect}
                />
              </>
            ) : (
              cheapestPrice !== null && (
                <Button onClick={handleBuyNonNumbered}>
                  Dodaj do koszyka bilet za {cheapestPrice.toFixed(2)} zł
                </Button>
              )
            )}

            {cartError && <ErrorMessage>{cartError}</ErrorMessage>}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}

export default EventPage;
