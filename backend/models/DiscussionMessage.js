const mongoose = require('mongoose');

const DiscussionMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderUserId: {
      type: String,
      default: '',
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

DiscussionMessageSchema.index({ roomId: 1, createdAt: 1 });

module.exports = mongoose.model('DiscussionMessage', DiscussionMessageSchema);
