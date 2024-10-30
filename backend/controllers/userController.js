const pool = require('../config/db');

// Getting all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Getting user profile
exports.getUserProfile =  async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM public.users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};