const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// User register
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO public.users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM public.users WHERE email = $1 OR username = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Return user data along with success message
        res.json({ success: true, message: 'Logged in successfully', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};