const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const { validateRegisterInput } = require('../../utils/validateInput');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    console.log('Registering user:', { username, email });

    validateRegisterInput(req.body); // Validate input

    const allowedRoles = ['buyer', 'organizer'];
    const userRole = role && allowedRoles.includes(role) ? role : 'buyer'; // Default role is 'buyer'

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM public.users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      console.log('User already exists with email:', email);
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const result = await pool.query(
      'INSERT INTO public.users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, userRole]
    );

    console.log('User inserted:', result.rows[0]);

    res
      .status(201)
      .json({ 
        success: true, 
        message: 'User registered successfully',
        user: {
          user_id: result.rows[0].user_id,
          username: result.rows[0].username,
          email: result.rows[0].email,
          role: result.rows[0].role,
        }
      });
  } catch (err) {
    console.error('Registration error:', err.message);
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error while registering new user.',
      });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request:', { email, password });

    const userResult = await pool.query(
      'SELECT * FROM public.users WHERE email = $1',
      [email]
    );
    if (userResult.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      user_id: user.user_id, 
      role: user.role 
    }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
