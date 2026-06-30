const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hdi_secret_token_123_key_99', {
    expiresIn: '30d',
  });
};

// Helper to build user response object (includes new fields)
const buildUserResponse = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  credits: user.credits,
  isPremium: user.isPremium,
  token: generateToken(user._id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide a username, email, and password.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists (by email or username)
    const userExists = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }] 
    });

    if (userExists) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json(buildUserResponse(user));
    } else {
      return res.status(400).json({ error: 'Invalid user data.' });
    }

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json(buildUserResponse(user));
    } else {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};
