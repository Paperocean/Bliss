import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import 'styles/Form.css';
import './SeatPricing.css';

import InputText from '../props/InputField/InputField';
import Button from '../props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';

const SeatGrid = ({
  rows,
  seatsPerRow,
  seatPrices,
  handleSeatClick,
  bulkUpdateSeatPrices,
  currentSeatPrice,
  setCurrentSeatPrice,
  errorMessage,
}) => {
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [message, setMessage] = useState('');

  const getHighestPrice = () => {
    const prices = Object.values(seatPrices).map((seat) => seat.price || 0);
    return Math.max(...prices, 1);
  };

  const renderSeatGrid = () => {
    const rowLabels = Array.from({ length: parseInt(rows, 10) || 0 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    const seatsPerRowNumber = parseInt(seatsPerRow, 10) || 0;
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
                    {seatPrices[seatId] ? `${seatPrices[seatId].price} zł` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Handle price setting for whole row
  const handleSetPriceForRow = () => {
    if (!selectedRow || !currentSeatPrice) return;
    const maxRow = String.fromCharCode(65 + parseInt(rows, 10) - 1);
    if (!/^[A-Z]$/.test(selectedRow) || selectedRow > maxRow) {
      setMessage(
        `Niepoprawny znak rzędu. Wprowadź znak pomiędzy A i ${maxRow}.`
      );
      return;
    }

    const rowSeats = Array.from(
      { length: parseInt(seatsPerRow, 10) || 0 },
      (_, j) => `${selectedRow}${j + 1}`
    );
    bulkUpdateSeatPrices(rowSeats, parseFloat(currentSeatPrice));
    setSelectedRow('');
  };

  // Handle price setting for whole column
  const handleSetPriceForColumn = () => {
    if (!selectedColumn || !currentSeatPrice) return;

    if (isNaN(currentSeatPrice) || currentSeatPrice < 0) {
      setMessage('Wprowadź poprawną, nieujemną cenę biletu.');
      return;
    }
    const columnNumber = parseInt(selectedColumn, 10);
    const maxSeatsPerRow = parseInt(seatsPerRow, 10);

    if (
      isNaN(columnNumber) ||
      columnNumber < 1 ||
      columnNumber > maxSeatsPerRow
    ) {
      setMessage(
        `Niepoprawny numer kolumny. Wprowadź wartość pomiędzy 1 i ${maxSeatsPerRow}.`
      );
      return;
    }

    const columnSeats = Array.from(
      { length: parseInt(rows, 10) || 0 },
      (_, i) => `${String.fromCharCode(65 + i)}${columnNumber}`
    );

    bulkUpdateSeatPrices(columnSeats, parseFloat(currentSeatPrice));
    setSelectedColumn('');
  };

  // Handle price setting for all seats
  const handleSetPriceForAllSeats = () => {
    const price = parseFloat(currentSeatPrice);

    if (isNaN(price) || price < 0) {
      setMessage('Wprowadź poprawną, nieujemną cenę biletu');
      return;
    }

    const totalRows = parseInt(rows, 10) || 0;
    const seatsPerRowCount = parseInt(seatsPerRow, 10) || 0;
    const allSeatIds = [];

    for (let i = 0; i < totalRows; i++) {
      const rowLabel = String.fromCharCode(65 + i);
      for (let j = 1; j <= seatsPerRowCount; j++) {
        allSeatIds.push(`${rowLabel}${j}`);
      }
    }

    bulkUpdateSeatPrices(allSeatIds, price);
    setCurrentSeatPrice('');
  };

  return (
    <div className="seat-grid-wrapper">
      {/* Left Section: Controls */}
      <div className="left-section">
        <div className="form">
          <h1 className="form-title">Mapowanie biletów</h1>
          {/* Row Selection and Price Setting */}
          <InputText
            label="Cena biletu"
            type="number"
            name="seat-price"
            id="seat-price"
            value={currentSeatPrice}
            onChange={(e) => setCurrentSeatPrice(e.target.value)}
            placeholder="Wprowadź wartość"
          />
          <div className="form-group">
            <InputText
              label="Numer rzędu"
              name="row-select"
              id="row-select"
              value={selectedRow}
              onChange={(e) => setSelectedRow(e.target.value)}
              placeholder="Wprowadź wartość"
            />
            <Button
              onClick={handleSetPriceForRow}
              disabled={!selectedRow || !currentSeatPrice}
            >
              Ustaw cenę za rząd
            </Button>
          </div>

          {/* Column Selection and Price Setting */}
          <div className="form-group">
            <InputText
              label="Numer kolumny"
              type="number"
              name="column-select"
              id="column-select"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              placeholder="Wprowadź wartość"
            />
            <Button
              onClick={handleSetPriceForColumn}
              disabled={!selectedColumn || !currentSeatPrice}
            >
              Ustaw cenę za kolumnę
            </Button>
          </div>

          {/* Set Price for All Seats */}
          <div className="form-group">
            <Button
              onClick={handleSetPriceForAllSeats}
              disabled={!currentSeatPrice}
            >
              Ustaw cenę za wszystkie miejsca
            </Button>
          </div>
        </div>
        {(errorMessage || message) && (
          <ErrorMessage message={errorMessage || message} />
        )}
      </div>
      {/* Right Section: Seat Grid */}
      <div className="right-section">
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
          <TransformComponent className="transform-component">
            {renderSeatGrid()}
          </TransformComponent>
        </TransformWrapper>
      </div>
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
