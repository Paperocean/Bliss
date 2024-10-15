const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia z bazą danych
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.post('/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
});

// Endpoint rejestracji
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Sprawdzenie, czy użytkownik już istnieje
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hashowanie hasła przed zapisaniem do bazy
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodanie nowego użytkownika do bazy
    try {
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint logowania
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            const match = await bcrypt.compare(password, user.rows[0].password);
            if (match) {
                return res.status(200).json({ success: true, message: 'Login successful' });
            }
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        return res.status(404).json({ success: false, message: 'User not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Nasłuchiwanie na porcie
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});