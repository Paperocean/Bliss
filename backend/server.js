const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/api/tickets', async (req, res) => {
  try {
    console.log("Request received for tickets");
    const result = await pool.query('SELECT * FROM tickets');
    console.log("Query result:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error message:", err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint root '/' now queries the database and displays result
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows); // Return tickets as the response
  } catch (err) {
    console.error("Error fetching tickets:", err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
