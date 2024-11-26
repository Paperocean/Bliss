const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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

        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
