const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  interactionStats: {
    readingSpeed: { type: Number, default: 0 },
    highlightUsage: { type: Number, default: 0 },
    discussionEngagement: { type: Number, default: 0 },
  },
  likedBooks: [{ type: String }],
  dislikedBooks: [{ type: String }],
  recommendationProfile: {
    dominantGenres: [{ type: String }],
    scoreBlend: {
      readingSpeed: { type: Number, default: 0 },
      highlightUsage: { type: Number, default: 0 },
      discussionEngagement: { type: Number, default: 0 },
    },
    lastCalibratedAt: { type: Date, default: null },
  },
  readingHistory: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    progress: { type: Number, default: 0 },
    lastRead: { type: Date, default: Date.now }
  }],
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  interests: [{ type: String, default: ['Sci-Fi', 'Molecular Biology'] }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  if (!this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
