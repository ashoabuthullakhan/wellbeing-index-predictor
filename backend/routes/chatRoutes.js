const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage } = require('../controllers/chatController');

// POST /api/chat — Send a message to the AI assistant
router.post('/', protect, sendMessage);

module.exports = router;
