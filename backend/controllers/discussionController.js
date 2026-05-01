const DiscussionMessage = require('../models/DiscussionMessage');

const normalizeRoomId = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

const serializeDiscussionMessage = (message) => ({
  _id: message._id,
  roomId: message.roomId,
  senderName: message.senderName,
  senderUserId: message.senderUserId || '',
  text: message.text,
  createdAt: message.createdAt,
});

const getRoomMessages = async (req, res) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);

    if (!roomId) {
      return res.status(400).json({ message: 'A valid roomId is required.' });
    }

    const messages = await DiscussionMessage.find({ roomId }).sort({ createdAt: 1 }).limit(100);

    res.json({
      roomId,
      messages: messages.map(serializeDiscussionMessage),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load discussion messages right now.' });
  }
};

module.exports = {
  getRoomMessages,
  normalizeRoomId,
  serializeDiscussionMessage,
};
