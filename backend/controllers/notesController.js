const Note = require('../models/Note');

// Get notes by type
const getNotesByType = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ msg: 'Please provide title, content, and type' });
    }

    const newNote = new Note({
      title,
      content,
      type,
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getNotesByType,
  createNote,
};
