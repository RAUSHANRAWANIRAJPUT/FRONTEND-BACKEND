const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const ClubBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: '' },
    status: { type: String, default: 'In Progress' },
  },
  { _id: false }
);

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  memberCount: { type: Number, default: 0 },
  book: { type: ClubBookSchema, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chapters: [ChapterSchema],
  inviteLink: { type: String },
  inviteCode: { type: String },
  status: { type: String, default: 'Reading' },
}, { timestamps: true });

module.exports = mongoose.model('Club', ClubSchema);
