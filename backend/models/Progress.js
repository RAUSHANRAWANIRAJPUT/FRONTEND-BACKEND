const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  completedChapters: [{ type: Number }],
}, { timestamps: true });

// Ensure a user has only one progress record per club
ProgressSchema.index({ userId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
