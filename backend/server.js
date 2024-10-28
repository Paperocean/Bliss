require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Middleware to handle JSON

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are filled
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Store password in plaintext (not secure)
  const password_hash = password; // Storing plaintext (not recommended)

  // SQL query to add the user
  const sql = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)';
  pool.query(sql, [username, email, password_hash], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Log database error
      return res.status(500).json({ success: false, message: 'Registration failed' });
    }
    res.status(201).json({ success: true, message: 'User registered successfully' });
  });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists - you can add the option to log in with username
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Check if the password matches (in plaintext)
    if (user.password_hash !== password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, message: 'Logged in successfully', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
