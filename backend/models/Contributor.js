const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ContributorSchema.index({ userId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model('Contributor', ContributorSchema);
