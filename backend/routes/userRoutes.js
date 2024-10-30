const express = require('express');
const { getAllUsers, getUserProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/users', getAllUsers);
router.get('/profile', getUserProfile);

module.exports = router;