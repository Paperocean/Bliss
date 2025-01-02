import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import useCart from 'hooks/cartHooks/useCart';
import './SeatMap.css';

const SeatMapUser = ({ event, seats }) => {
  const { cart, addSeatToCart, removeSeatFromCart } = useCart();

  const seatMap = new Map();
  seats.forEach((s) => {
    seatMap.set(s.seat_label, {
      ...s,
      price: parseFloat(s.price),
    });
  });

  const prices = Array.from(seatMap.values()).map((s) => s.price);
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 1;

  const interpolateColor = (price, maxPrice) => {
    const normalized = price / maxPrice;
    const startColor = { r: 106, g: 156, b: 137 };
    const endColor = { r: 22, g: 66, b: 60 };

    const r = Math.round(
      startColor.r + (endColor.r - startColor.r) * normalized
    );
    const g = Math.round(
      startColor.g + (endColor.g - startColor.g) * normalized
    );
    const b = Math.round(
      startColor.b + (endColor.b - startColor.b) * normalized
    );
    return `rgb(${r}, ${g}, ${b})`;
  };

  const totalRows = parseInt(event.rows || 0, 10);
  const seatsPerRow = parseInt(event.seats_per_row || 0, 10);

  const rowLabels = Array.from({ length: totalRows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const handleSeatClick = (seatLabel) => {
    const seatData = seatMap.get(seatLabel);
    if (!seatData) {
      return;
    }

    const isInCart = cart.some((item) => item.ticket_id === seatData.ticket_id);

    if (isInCart) {
      removeSeatFromCart(seatData.ticket_id);
    } else {
      addSeatToCart(seatData);
    }
  };

  const isInCart = (seatLabel) => {
    const seatData = seatMap.get(seatLabel);
    if (!seatData) return false;
    return cart.some((item) => item.ticket_id === seatData.ticket_id);
  };

  return (
    <div className="seat-map-user-wrapper">
      <TransformWrapper
        defaultScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ step: 50 }}
        panning={{
          velocityDisabled: true,
          padding: { top: 100, left: 100, right: 100, bottom: 100 },
        }}
      >
        <TransformComponent>
          <div className="seat-grid-container">
            {rowLabels.map((row) => (
              <div key={row} className="seat-row">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNumber = i + 1;
                  const seatLabel = `${row}${seatNumber}`;
                  const seatData = seatMap.get(seatLabel);
                  const isAvailable = Boolean(seatData);
                  const selected = isInCart(seatLabel);

                  const bgColor = isAvailable
                    ? interpolateColor(seatData.price, highestPrice)
                    : '#666';

                  return (
                    <div
                      key={seatLabel}
                      className={`seat ${selected ? 'seat-selected' : ''}`}
                      style={{
                        backgroundColor: bgColor,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.5,
                      }}
                      onClick={() => handleSeatClick(seatLabel)}
                    >
                      <div className="seat_id">{seatLabel}</div>
                      {isAvailable && (
                        <div className="seat_price">{seatData.price} zł</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default SeatMapUser;
