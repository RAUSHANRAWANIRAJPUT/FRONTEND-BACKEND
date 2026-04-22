const Contributor = require('../models/Contributor');

exports.getContributors = async (req, res) => {
  try {
    const contributors = await Contributor.find({ clubId: req.params.clubId })
      .populate('userId', 'name avatar profilePicture')
      .sort({ points: -1, updatedAt: -1 });

    res.json(
      contributors.map((contributor) => ({
        _id: contributor._id,
        clubId: contributor.clubId,
        points: contributor.points,
        user: {
          _id: contributor.userId._id,
          name: contributor.userId.name,
          avatar: contributor.userId.avatar || contributor.userId.profilePicture || '',
        },
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch contributors right now.' });
  }
};
