const db = require('../../config/db');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userResult = await db.query(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: userResult.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.fetchUserTickets = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const result = await db.query(
      `SELECT
          ticket_id,
          event_id,
          user_id,
          purchase_time,
          price,
          status,
          seat_label,
          created_at,
          updated_at
        FROM public.tickets
        WHERE user_id = $1
        ORDER BY purchase_time DESC`,
      [user_id]
    );
    res.status(200).json({ success: true, tickets: result.rows });
  } catch (error) {
    console.error('Error fetching users tickets: ', error.message);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch users tickets.' });
  }
};
