const User = require('../models/User');

// @desc    Get current user profile (credits, premium status)
// @route   GET /api/user/profile
// @access  Protected
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      credits: user.credits,
      isPremium: user.isPremium,
      dailyPredictionsUsed: user.dailyPredictionsUsed,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    return res.status(500).json({ error: 'Server error fetching profile.' });
  }
};
