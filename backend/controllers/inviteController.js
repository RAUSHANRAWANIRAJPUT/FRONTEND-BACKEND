const crypto = require('crypto');
const Club = require('../models/Club');

exports.generateInvite = async (req, res) => {
  try {
    const { clubId } = req.body;

    if (!clubId) {
      return res.status(400).json({ message: 'clubId is required.' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    const inviteCode = crypto.randomBytes(10).toString('hex');
    const frontendBaseUrl = process.env.FRONTEND_APP_URL || 'http://localhost:5173';
    const inviteLink = `${frontendBaseUrl}/invite/${clubId}?code=${inviteCode}`;

    club.inviteCode = inviteCode;
    club.inviteLink = inviteLink;
    await club.save();

    res.json({ inviteLink, inviteCode });
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate an invite link.' });
  }
};
