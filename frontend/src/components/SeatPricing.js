import React from 'react';
import '../styles/SeatPricing.css'; 

const SeatGrid = ({ 
    rows,
    seatsPerRow, 
    seatPrices, 
    handleSeatClick, 
    currentSeatPrice, 
    setCurrentSeatPrice,
}) => {
    const getHighestPrice = () => {
        const prices = Object.values(seatPrices).map((seat) => seat.price || 0);
        return Math.max(...prices, 1);
    };

    const renderSeatGrid = () => {
        const rowLabels = Array.from({ length: parseInt(rows, 10) }, (_, i) =>
            String.fromCharCode(65 + i)
        );
        const seatsPerRowNumber = parseInt(seatsPerRow, 10);
        const highestPrice = getHighestPrice();

        return (
            <div className="seat-grid-container">
                {rowLabels.map((row) => (
                    <div key={row} className="seat-row">
                        {Array.from({ length: seatsPerRowNumber }, (_, j) => {
                            const seatId = `${row}${j + 1}`;
                            const seatPrice = seatPrices[seatId]?.price || 0;
                            const backgroundColor = seatPrice
                                ? interpolateColor(seatPrice, highestPrice)
                                : '#161616';

                            return (
                                <div
                                    key={seatId}
                                    className={`seat ${
                                        seatPrices[seatId] ? 'seat-selected' : ''
                                    }`}
                                    onClick={() => handleSeatClick(seatId)}
                                    style={{ backgroundColor }}
                                >
                                    <div className="seat_id">{seatId}</div>
                                    <div className="seat_price">
                                        {seatPrices[seatId] ? `$${seatPrices[seatId].price}` : ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="seat-grid-wrapper">
            <input
                type="number"
                value={currentSeatPrice}
                onChange={(e) => setCurrentSeatPrice(e.target.value)}
                placeholder="Seat Price"
                className="seat-price-input"
            />
            {renderSeatGrid()}
        </div>
    );
};

const interpolateColor = (price, highestPrice) => {
    const normalized = price / highestPrice;

    const startColor = { r: 106, g: 156, b: 137 };
    const endColor = { r: 22, g: 66, b: 60 };

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalized);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalized);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalized);

    return `rgb(${r}, ${g}, ${b})`;
};

export default SeatGrid;
