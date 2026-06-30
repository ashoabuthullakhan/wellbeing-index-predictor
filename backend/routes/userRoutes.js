const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

// GET /api/user/profile — Get current user profile
router.get('/profile', protect, getProfile);

module.exports = router;
