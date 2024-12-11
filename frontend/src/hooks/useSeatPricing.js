import { useState } from 'react';

const useSeatPricing = () => {
  const [seatPrices, setSeatPrices] = useState({});
  const [currentSeatPrice, setCurrentSeatPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSeatClick = (seatId, priceOverride = null) => {
    const price =
      priceOverride !== null ? priceOverride : parseFloat(currentSeatPrice);
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

  const bulkUpdateSeatPrices = (seatIds, price) => {
    setSeatPrices((prevPrices) => {
      const updatedPrices = { ...prevPrices };
      seatIds.forEach((id) => {
        updatedPrices[id] = { price };
      });
      return updatedPrices;
    });
  };

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
    bulkUpdateSeatPrices,
    resetSeatPricing,
    setErrorMessage,
  };
};

export default useSeatPricing;
