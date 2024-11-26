const jwt = require('jsonwebtoken');

// Middleware autoryzacji tokenu
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pobranie tokenu z nagłówka

    if (!token) {
        console.error('No token provided in Authorization header.');
        return res.status(401).json({
            success: false,
            message: 'Access denied. Token missing.',
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token.',
            });
        }

        req.user = user; // Przypisanie danych użytkownika do żądania
        next(); // Przejdź do kolejnego middleware
    });
};

module.exports = authenticateToken;
