import { useState } from "react";

const useSeatPricing = () => {
    const [seatPrices, setSeatPrices] = useState({});
    const [currentSeatPrice, setCurrentSeatPrice] = useState(''); // Ensure this is correctly initialized
    const [errorMessage, setErrorMessage] = useState('');

    const handleSeatClick = (seatId) => {
        if (!currentSeatPrice) {
            setErrorMessage('Please enter a price before selecting a seat.');
            return;
        }

        setSeatPrices((prev) => ({
            ...prev,
            [seatId]: {
                id: seatId,
                price: parseFloat(currentSeatPrice),
            },
        }));
        setErrorMessage(''); // Clear error once a seat is successfully set
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
        setCurrentSeatPrice, // Export this function
        handleSeatClick,
        resetSeatPricing,
        setErrorMessage,
    };
};

export default useSeatPricing;
