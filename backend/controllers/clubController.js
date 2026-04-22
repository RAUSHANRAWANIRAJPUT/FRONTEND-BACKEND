const Club = require('../models/Club');
const Progress = require('../models/Progress');
const User = require('../models/User');

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar || user.profilePicture || '',
  };
};

const serializeClub = (club) => ({
  _id: club._id,
  name: club.name,
  description: club.description,
  members: club.members.map(serializeUser),
  memberCount: club.memberCount || club.members.length,
  book: club.book,
  chapters: club.chapters,
  inviteLink: club.inviteLink,
  status: club.status,
});

exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('members', 'name avatar profilePicture')
      .sort({ createdAt: -1 });

    res.json(clubs.map(serializeClub));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch clubs right now.' });
  }
};

exports.createClub = async (req, res) => {
  try {
    const { name, description, owner, book, chapters = [], memberCount } = req.body;

    if (!name || !owner || !book?.title) {
      return res.status(400).json({ message: 'Name, owner, and book title are required.' });
    }

    const newClub = await Club.create({
      name,
      description,
      owner,
      members: [owner],
      memberCount: memberCount || 1,
      book: {
        title: book.title,
        author: book.author || '',
        status: book.status || 'In Progress',
      },
      chapters,
      status: req.body.status || 'Reading',
    });

    const club = await Club.findById(newClub._id).populate('members', 'name avatar profilePicture');
    res.status(201).json(serializeClub(club));
  } catch (error) {
    res.status(500).json({ message: 'Unable to create club right now.' });
  }
};

exports.getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const [club, viewer, viewerProgress] = await Promise.all([
      Club.findById(id).populate('members', 'name avatar profilePicture'),
      userId ? User.findById(userId).select('name avatar profilePicture') : null,
      userId ? Progress.findOne({ clubId: id, userId }) : null,
    ]);

    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    res.json({
      club: serializeClub(club),
      viewer: serializeUser(viewer),
      viewerProgress: viewerProgress?.completedChapters || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch the club.' });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const { name, book, status } = req.body;
    const update = {};

    if (name) {
      update.name = name;
    }

    if (status) {
      update.status = status;
    }

    if (book) {
      update.book = {
        title: book.title || '',
        author: book.author || '',
        status: book.status || 'In Progress',
      };
    }

    const club = await Club.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' })
      .populate('members', 'name avatar profilePicture');

    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    res.json(serializeClub(club));
  } catch (error) {
    res.status(500).json({ message: 'Unable to update club settings.' });
  }
};

exports.joinClub = async (req, res) => {
  try {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    const hasJoined = club.members.some((memberId) => memberId.toString() === userId);
    if (hasJoined) {
      return res.status(400).json({ message: 'User is already a member of this club.' });
    }

    club.members.push(userId);
    club.memberCount = Math.max(club.memberCount || 0, club.members.length);
    await club.save();

    const populatedClub = await Club.findById(club._id).populate('members', 'name avatar profilePicture');
    res.json(serializeClub(populatedClub));
  } catch (error) {
    res.status(500).json({ message: 'Unable to join the club right now.' });
  }
};
