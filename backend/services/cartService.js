const db = require('../config/db');

const discountCodes = {
    WELCOME10: 0.1, // 10% zniżki
    SUMMER20: 0.2,  // 20% zniżki
};

exports.validateDiscountCode = async (code) => {
    return discountCodes.hasOwnProperty(code) ? discountCodes[code] : null;
};

exports.calculateCart = async (cart, discountCode = null) => {
    try {
        // Wyciągnięcie ticket_id z koszyka
        const ticketIds = cart.map((item) => item.ticket_id);

        // Jeśli koszyk jest pusty, zwróć 0
        if (ticketIds.length === 0) {
            return { totalAmount: 0 }; 
        }

        // Zapytanie SQL do pobrania cen biletów z bazy danych
        const ticketQuery = `
            SELECT ticket_id, price
            FROM tickets
            WHERE ticket_id = ANY($1) AND status = 'available'
        `;

        // Wykonanie zapytania do bazy danych
        const result = await db.query(ticketQuery, [ticketIds]);

        // Jeśli brak wyników z bazy, zwróć 0
        if (result.rows.length === 0) {
            return { totalAmount: 0 };
        }

        // Obliczenie sumy cen biletów
        let totalAmount = 0;

        result.rows.forEach(row => {
            const cartItem = cart.find(item => item.ticket_id === row.ticket_id);
            if (cartItem) {
                totalAmount += parseFloat(row.price); // Konwersja ceny na liczbę i dodanie do sumy
            }
        });

        // Zastosowanie rabatu, jeśli jest kod rabatowy
        if (discountCode) {
            const discount = discountCodes[discountCode];
            if (discount) {
                totalAmount = totalAmount - totalAmount * discount; // Zastosowanie rabatu
            }
        }

        return { totalAmount: parseFloat(totalAmount.toFixed(2)) };

    } catch (error) {
        console.error('Error calculating cart total:', error);
        throw new Error('Error calculating cart total');
    }
};

exports.finalizePurchase = async (cart) => {
    try {
        const ticketIds = cart.map(item => item.ticket_id);

        // Zapytanie do bazy danych w celu zaktualizowania statusu biletów na 'sold'
        const updateQuery = `
            UPDATE tickets
            SET status = 'sold'
            WHERE ticket_id = ANY($1) AND status = 'available'
        `;
        const result = await db.query(updateQuery, [ticketIds]);

        if (result.rowCount === 0) {
            return { success: false, message: 'Some tickets are already sold or not available.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error during purchase finalization:', error.message);
        throw new Error('Error finalizing purchase.');
    }
};
