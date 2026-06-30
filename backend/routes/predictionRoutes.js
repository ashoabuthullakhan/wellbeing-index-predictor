const express = require('express');
const router = express.Router();
const { createPrediction, getPredictionHistory, deletePrediction } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/predict', protect, createPrediction);
router.get('/history', protect, getPredictionHistory);
router.delete('/predict/:id', protect, deletePrediction);

module.exports = router;
