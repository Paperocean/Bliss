const express = require('express');
const { calculateCart } = require('./cartController');

const router = express.Router();

router.post('/calculate', calculateCart);

module.exports = router;
