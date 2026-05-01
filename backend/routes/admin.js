const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const ensureTargetIsNotCurrentAdmin = (req, res, targetUserId, nextRole = null) => {
  const currentAdminId = req.currentUser?._id?.toString();

  if (!currentAdminId || currentAdminId !== String(targetUserId)) {
    return false;
  }

  if (nextRole && nextRole === 'admin') {
    return false;
  }

  res.status(400).json({ message: 'You cannot remove your own admin access or delete your own account.' });
  return true;
};

// Get all users (Admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    if (ensureTargetIsNotCurrentAdmin(req, res, req.params.id)) {
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUserId: user._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user with beginner-friendly route name (Admin only)
router.delete('/delete-user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    if (ensureTargetIsNotCurrentAdmin(req, res, req.params.id)) {
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUserId: user._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (ensureTargetIsNotCurrentAdmin(req, res, req.params.id, role)) {
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all notes for admin management
router.get('/notes', verifyToken, isAdmin, async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete note (Admin only)
router.delete('/notes/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully', deletedNoteId: note._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
