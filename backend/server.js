const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const connectDB = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const { stripeWebhook } = require('./controllers/paymentController');

// Connect to MongoDB database
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Stripe webhook MUST be parsed as raw buffer before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Parse JSON request bodies for all other routes
app.use(express.json());

// API Routes
app.use('/api', predictionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/blog', blogRoutes);

// Catch-all route for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express Backend Server running on port ${PORT}`);
});
