const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  genre: [String],
  audienceTags: [String],
  pages: { type: Number },
  rating: { type: Number, default: 0 },
  recommendationScore: { type: Number, default: 0 },
  recommendationReason: { type: String, default: '' },
  recommendationFactors: {
    readingSpeed: { type: Number, default: 0 },
    highlightUsage: { type: Number, default: 0 },
    discussionEngagement: { type: Number, default: 0 },
    preferenceAlignment: { type: Number, default: 0 },
  },
  lastRecalibratedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
