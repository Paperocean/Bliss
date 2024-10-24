require('dotenv').config();
const express = require('express');
const pool = require('./db'); // import połączenia do bazy danych

const app = express();

// Prosty endpoint, który pobiera dane z bazy
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
});

// Port, na którym działa aplikacja
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
