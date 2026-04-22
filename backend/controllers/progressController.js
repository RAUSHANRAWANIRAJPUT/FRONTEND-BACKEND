const Contributor = require('../models/Contributor');
const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
  try {
    const { userId, clubId, chapterNumber } = req.body;
    const parsedChapter = Number(chapterNumber);

    if (!userId || !clubId || Number.isNaN(parsedChapter)) {
      return res.status(400).json({ message: 'userId, clubId, and a valid chapterNumber are required.' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, clubId },
      {
        $addToSet: { completedChapters: parsedChapter },
      },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    await Contributor.findOneAndUpdate(
      { userId, clubId },
      { $inc: { points: 2 } },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update reading progress.' });
  }
};

exports.getProgressForUser = async (req, res) => {
  try {
    const filter = { userId: req.params.userId };
    if (req.query.clubId) {
      filter.clubId = req.query.clubId;
    }

    const progress = await Progress.find(filter).sort({ updatedAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch progress right now.' });
  }
};
