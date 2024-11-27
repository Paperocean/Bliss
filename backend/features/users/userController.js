const pool = require('../../config/db');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: userResult.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
