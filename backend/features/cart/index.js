const express = require('express');
const { checkout, applyDiscount } = require('./cartController');

const router = express.Router();

router.post('/checkout', checkout);
router.post('/applyDiscount', applyDiscount);

module.exports = router;
