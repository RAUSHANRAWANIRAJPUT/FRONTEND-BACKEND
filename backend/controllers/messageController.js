const Club = require('../models/Club');
const Contributor = require('../models/Contributor');
const Message = require('../models/Message');
const User = require('../models/User');

const serializeMessage = (message) => ({
  _id: message._id,
  text: message.text,
  chapterNumber: message.chapterNumber,
  createdAt: message.createdAt,
  clubId: message.clubId,
  user: {
    _id: message.user._id,
    name: message.user.name,
    avatar: message.user.avatar || message.user.profilePicture || '',
  },
});

const getMessageFilter = (clubId, chapter) => {
  const filter = { clubId };

  if (chapter === undefined || chapter === null || chapter === '') {
    filter.chapterNumber = null;
    return filter;
  }

  const parsedChapter = Number(chapter);
  if (Number.isNaN(parsedChapter)) {
    filter.chapterNumber = null;
    return filter;
  }

  filter.chapterNumber = parsedChapter;
  return filter;
};

exports.getMessages = async (req, res) => {
  try {
    const filter = getMessageFilter(req.params.clubId, req.query.chapter);
    const messages = await Message.find(filter)
      .populate('user', 'name avatar profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages.map(serializeMessage));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch messages right now.' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { clubId, text, userId, chapterNumber = null } = req.body;
    const trimmedText = text?.trim();

    if (!clubId || !userId || !trimmedText) {
      return res.status(400).json({ message: 'clubId, userId, and text are required.' });
    }

    const [club, user] = await Promise.all([
      Club.findById(clubId),
      User.findById(userId),
    ]);

    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const message = await Message.create({
      clubId,
      text: trimmedText,
      user: userId,
      chapterNumber: chapterNumber || null,
    });

    await Contributor.findOneAndUpdate(
      { clubId, userId },
      { $inc: { points: 5 } },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    const populatedMessage = await Message.findById(message._id).populate('user', 'name avatar profilePicture');
    const payload = serializeMessage(populatedMessage);

    const io = req.app.get('io');
    io.to(`club:${clubId}`).emit('message:created', payload);

    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Unable to send the message.' });
  }
};
