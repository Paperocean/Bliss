const db = require('../../config/db');
const bcrypt = require('bcryptjs');

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
        .json({ success: false, message: 'Użytkownik nie został znaleziony.' });
    }
    res.json({ success: true, user: userResult.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Wystąpił błąd serwera.' });
  }
};

exports.getUserTickets = async (req, res) => {
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
    console.error(
      'Błąd podczas pobierania biletów użytkownika: ',
      error.message
    );
    res.status(500).json({
      success: false,
      message: 'Nie udało się pobrać biletów użytkownika.',
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Wszystkie pola są wymagane.' });
    }

    const userResult = await db.query(
      'SELECT password_hash FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Użytkownik nie został znaleziony.' });
    }

    const storedHash = userResult.rows[0].password_hash;

    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Aktualne hasło jest nieprawidłowe.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [
      newHash,
      userId,
    ]);

    res
      .status(200)
      .json({ success: true, message: 'Hasło zostało pomyślnie zmienione.' });
  } catch (error) {
    console.error('Błąd podczas zmiany hasła:', error.message);
    res.status(500).json({
      success: false,
      message: 'Nie udało się zmienić hasła. Spróbuj ponownie później.',
    });
  }
};
