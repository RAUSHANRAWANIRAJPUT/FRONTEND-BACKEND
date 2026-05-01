const Note = require('../models/Note');

const NOTE_TYPE_ALIASES = {
  theme: 'theme',
  'theme notes': 'theme',
  discussion: 'discussion',
  'discussion notes': 'discussion',
  reflection: 'reflection',
  reflections: 'reflection',
  'personal reflection': 'reflection',
  'personal reflections': 'reflection',
};

const normalizeNoteType = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return NOTE_TYPE_ALIASES[normalizedValue] || null;
};

// Get notes by type
const getNotesByType = async (req, res) => {
  try {
    const { type } = req.query;
    const normalizedType = type ? normalizeNoteType(type) : null;

    if (type && !normalizedType) {
      return res.status(400).json({ msg: 'Invalid note type' });
    }

    const query = normalizedType ? { type: normalizedType } : {};
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
    const normalizedType = normalizeNoteType(type);
    const trimmedTitle = String(title || '').trim();
    const trimmedContent = String(content || '').trim();

    if (!trimmedTitle || !trimmedContent || !normalizedType) {
      return res.status(400).json({ msg: 'Please provide title, content, and type' });
    }

    const newNote = new Note({
      title: trimmedTitle,
      content: trimmedContent,
      type: normalizedType,
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getNotesByType,
  createNote,
  normalizeNoteType,
};
