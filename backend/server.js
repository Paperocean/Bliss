require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./features');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', routes.auth);
app.use('/api/user', routes.user);
app.use('/api/events', routes.events);
app.use('/api/cart', routes.cart);
app.use('/api/tickets', routes.tickets);
app.use('/api/transaction', routes.transaction);

// 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Endpoint not found' })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
