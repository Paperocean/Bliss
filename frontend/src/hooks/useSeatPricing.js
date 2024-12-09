// src/hooks/useSeatPricing.js

import { useState } from 'react';

const useSeatPricing = () => {
  const [seatPrices, setSeatPrices] = useState({});
  const [currentSeatPrice, setCurrentSeatPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles updating the price of a single seat.
   * If priceOverride is provided, it uses that value; otherwise, it uses currentSeatPrice.
   * @param {string} seatId - The ID of the seat to update.
   * @param {number|null} priceOverride - The price to set for the seat.
   */
  const handleSeatClick = (seatId, priceOverride = null) => {
    const price = priceOverride !== null ? priceOverride : parseFloat(currentSeatPrice);
    if (isNaN(price) || price < 0) {
      setErrorMessage('Please enter a valid non-negative price.');
      return;
    }
    setSeatPrices((prev) => ({
      ...prev,
      [seatId]: { price },
    }));
    setErrorMessage('');
  };

  /**
   * Bulk updates the prices of multiple seats.
   * @param {Array<string>} seatIds - The IDs of the seats to update.
   * @param {number} price - The price to set for each seat.
   */
  const bulkUpdateSeatPrices = (seatIds, price) => {
    setSeatPrices((prevPrices) => {
      const updatedPrices = { ...prevPrices };
      seatIds.forEach((id) => {
        updatedPrices[id] = { price };
      });
      return updatedPrices;
    });
  };

  /**
   * Resets all seat prices and clears errors.
   */
  const resetSeatPricing = () => {
    setSeatPrices({});
    setCurrentSeatPrice('');
    setErrorMessage('');
  };

  return {
    seatPrices,
    currentSeatPrice,
    errorMessage,
    setCurrentSeatPrice,
    handleSeatClick,
    bulkUpdateSeatPrices, // Expose bulk update function
    resetSeatPricing,
    setErrorMessage,
  };
};

export default useSeatPricing;
