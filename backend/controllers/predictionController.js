const axios = require('axios');
const Prediction = require('../models/Prediction');
const User = require('../models/User');

const DAILY_FREE_LIMIT = 5;

// @desc    Make a prediction and save it to user's history
// @route   POST /api/predict
// @access  Private
exports.createPrediction = async (req, res) => {
  const { countryName, lifeExpectancy, meanYearsSchooling, expectedYearsSchooling, gniPerCapita } = req.body;

  // Basic validation
  if (
    lifeExpectancy === undefined || 
    meanYearsSchooling === undefined || 
    expectedYearsSchooling === undefined || 
    gniPerCapita === undefined
  ) {
    return res.status(400).json({ error: 'Please provide all required development indicators.' });
  }

  if (
    lifeExpectancy < 0 || 
    meanYearsSchooling < 0 || 
    expectedYearsSchooling < 0 || 
    gniPerCapita < 0
  ) {
    return res.status(400).json({ error: 'Indicators cannot be negative values.' });
  }

  const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000';
  const PREDICTION_COST = 10;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.credits < PREDICTION_COST) {
      return res.status(402).json({
        error: `You need ${PREDICTION_COST} credits to make a prediction. You have ${user.credits} credits remaining.`,
        required: PREDICTION_COST,
        available: user.credits
      });
    }

    // Call FastAPI ML microservice
    const response = await axios.post(`${mlApiUrl}/predict`, {
      life_expectancy: Number(lifeExpectancy),
      mean_years_schooling: Number(meanYearsSchooling),
      expected_years_schooling: Number(expectedYearsSchooling),
      gni_per_capita: Number(gniPerCapita),
    });

    const { hdi_score, hdi_category } = response.data;

    // Save prediction in MongoDB associated with logged-in user
    const newPrediction = new Prediction({
      userId: req.user.id,
      countryName: countryName || '',
      lifeExpectancy: Number(lifeExpectancy),
      meanYearsSchooling: Number(meanYearsSchooling),
      expectedYearsSchooling: Number(expectedYearsSchooling),
      gniPerCapita: Number(gniPerCapita),
      hdiScore: hdi_score,
      hdiCategory: hdi_category,
    });

    await newPrediction.save();

    // Deduct credits
    user.credits -= PREDICTION_COST;
    user.lastPredictionDate = new Date();
    await user.save();

    return res.status(201).json({ prediction: newPrediction, credits: user.credits });

  } catch (error) {
    console.error('Prediction controller error:', error.message);
    
    // Check if FastAPI is unreachable
    if (error.code === 'ECONNREFUSED' || (error.response && error.response.status === 503)) {
      return res.status(503).json({ 
        error: 'The ML prediction service is currently unavailable. Please verify it is running on port 8000.' 
      });
    }

    // Return FastAPI specific validation/error details if available
    if (error.response && error.response.data && error.response.data.detail) {
      return res.status(error.response.status).json({ 
        error: `ML Service Error: ${JSON.stringify(error.response.data.detail)}` 
      });
    }

    return res.status(500).json({ error: 'An unexpected backend error occurred.' });
  }
};

// @desc    Get user's prediction history
// @route   GET /api/predict/history
// @access  Private
exports.getPredictionHistory = async (req, res) => {
  try {
    const history = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error('History fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch history.' });
  }
};

// @desc    Delete a specific prediction
// @route   DELETE /api/predict/:id
// @access  Private
exports.deletePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found or unauthorized.' });
    }
    await prediction.deleteOne();
    return res.status(200).json({ success: true, message: 'Prediction deleted successfully.' });
  } catch (error) {
    console.error('Delete prediction error:', error.message);
    return res.status(500).json({ error: 'Failed to delete prediction.' });
  }
};
