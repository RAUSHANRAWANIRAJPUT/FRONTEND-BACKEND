const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

// @route   GET /api/notes
// @desc    Get notes by category
// @access  Public (for simplicity, but can add auth later)
router.get('/', notesController.getNotesByCategory);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Public
router.post('/', notesController.createNote);

module.exports = router;
