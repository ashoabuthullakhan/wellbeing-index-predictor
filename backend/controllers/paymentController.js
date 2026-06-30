const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/User');

const PACKS = {
  pack_100: { credits: 100, price: 499, name: '100 Credits' }, // $4.99
  pack_250: { credits: 250, price: 999, name: '250 Credits' }, // $9.99
  pack_700: { credits: 700, price: 1999, name: '700 Credits' }, // $19.99
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Protected
exports.createCheckoutSession = async (req, res) => {
  const { packId } = req.body;
  const pack = PACKS[packId];

  if (!pack) {
    return res.status(400).json({ error: 'Invalid credit pack selected.' });
  }

  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `HDI Insight - ${pack.name}`,
              description: 'AI-powered development analysis credits.',
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      client_reference_id: req.user._id.toString(),
      metadata: {
        packId,
        credits: pack.credits,
        userId: req.user._id.toString(),
      },
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&credits=${pack.credits}`,
      cancel_url: `${frontendUrl}/payment/cancel`,
    });

    // Record pending payment in DB
    await Payment.create({
      userId: req.user._id,
      stripeSessionId: session.id,
      amountPaid: pack.price,
      creditsPurchased: pack.credits,
      packId,
      status: 'pending',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return res.status(500).json({ error: 'Failed to create payment session.' });
  }
};

// @desc    Verify and claim Stripe Checkout Session
// @route   POST or GET /api/payments/verify-session
// @access  Protected
exports.verifySession = async (req, res) => {
  const sessionId = req.body.sessionId || req.query.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed.' });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    // If not already completed, mark as completed and credit the user
    if (payment.status !== 'completed') {
      payment.status = 'completed';
      await payment.save();

      const user = await User.findById(payment.userId);
      if (user) {
        user.credits += payment.creditsPurchased;
        user.isPremium = true;
        await user.save();
      }
      return res.status(200).json({ success: true, creditsAdded: payment.creditsPurchased, newTotal: user.credits });
    }

    // Already completed via webhook or previous poll
    const user = await User.findById(payment.userId);
    return res.status(200).json({ success: true, alreadyClaimed: true, newTotal: user ? user.credits : 0, creditsAdded: payment.creditsPurchased });

  } catch (error) {
    console.error('Session verification error:', error.message);
    return res.status(500).json({ error: 'Verification failed.' });
  }
};

// @desc    Stripe Webhook (handles completed payments)
// @route   POST /api/payments/webhook
// @access  Public (Called by Stripe)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // Note: req.body must be raw buffer for Stripe signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const payment = await Payment.findOne({ stripeSessionId: session.id });
      
      if (payment && payment.status !== 'completed') {
        payment.status = 'completed';
        await payment.save();

        const user = await User.findById(payment.userId);
        if (user) {
          user.credits += payment.creditsPurchased;
          user.isPremium = true; // Any purchase makes them premium
          await user.save();
          console.log(`Successfully credited ${payment.creditsPurchased} to user ${user.username}`);
        }
      }
    } catch (dbError) {
      console.error('Error processing completed payment:', dbError.message);
      // Even if DB fails, return 200 so Stripe doesn't infinitely retry
    }
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
};
