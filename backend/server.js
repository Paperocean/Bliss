const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
    res.send('Serwer działa!');
  });

app.listen(5000, () => {
  console.log('Server is running on port 3000');
});