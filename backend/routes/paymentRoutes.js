const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createCheckoutSession, verifySession } = require('../controllers/paymentController');

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', protect, createCheckoutSession);

// POST /api/payments/verify-session
router.post('/verify-session', protect, verifySession);

// GET /api/payments/verify-session
router.get('/verify-session', protect, verifySession);

module.exports = router;
