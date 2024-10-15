const express = require('express');
const pool = require('./db'); // importuj konfigurację połączenia z bazą
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json()); // Parsowanie JSON-a w żądaniach

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Sprawdź, czy użytkownik już istnieje
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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});