const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  countryName: {
    type: String,
    required: false,
    trim: true,
  },
  lifeExpectancy: {
    type: Number,
    required: true,
  },
  meanYearsSchooling: {
    type: Number,
    required: true,
  },
  expectedYearsSchooling: {
    type: Number,
    required: true,
  },
  gniPerCapita: {
    type: Number,
    required: true,
  },
  hdiScore: {
    type: Number,
    required: true,
  },
  hdiCategory: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prediction', PredictionSchema);
