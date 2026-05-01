import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, NotebookPen } from 'lucide-react';
import { notesApi } from '../lib/api';
import DiscussionRoomPage from './DiscussionRoomPage';

const NOTE_CATEGORY_CONFIG = {
  theme: {
    type: 'theme',
    title: 'Theme Notes',
    emptyMessage: 'No theme notes found yet.',
  },
  discussion: {
    type: 'discussion',
    title: 'Discussion Notes',
    emptyMessage: 'No discussion notes found yet.',
  },
  reflection: {
    type: 'reflection',
    title: 'Personal Reflections',
    emptyMessage: 'No personal reflections found yet.',
  },
};

const NOTE_CATEGORY_ALIASES = {
  theme: 'theme',
  'theme notes': 'theme',
  discussion: 'discussion',
  'discussion notes': 'discussion',
  reflection: 'reflection',
  reflections: 'reflection',
  'personal reflection': 'reflection',
  'personal reflections': 'reflection',
};

const resolveNoteCategory = (category) => {
  if (category && typeof category === 'object') {
    const normalizedType = NOTE_CATEGORY_ALIASES[String(category.type || '').trim().toLowerCase()];

    if (normalizedType) {
      return NOTE_CATEGORY_CONFIG[normalizedType];
    }

    const normalizedTitle = NOTE_CATEGORY_ALIASES[String(category.title || '').trim().toLowerCase()];
    return normalizedTitle ? NOTE_CATEGORY_CONFIG[normalizedTitle] : null;
  }

  const normalizedCategory = NOTE_CATEGORY_ALIASES[String(category || '').trim().toLowerCase()];
  return normalizedCategory ? NOTE_CATEGORY_CONFIG[normalizedCategory] : null;
};

const StandardNotesCategoryPage = ({ displayCategory, noteType, emptyMessage, setActivePage }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadNotes = async () => {
      if (!noteType) {
        if (!isActive) {
          return;
        }

        setNotes([]);
        setError('Invalid note category.');
        setIsLoading(false);
        return;
      }

      if (isActive) {
        setIsLoading(true);
      }

      try {
        const response = await notesApi.getByType(noteType);
        const filteredNotes = Array.isArray(response.data)
          ? response.data.filter((note) => note.type === noteType)
          : [];

        if (!isActive) {
          return;
        }

        setNotes(filteredNotes);
        setError('');
      } catch (err) {
        console.error('Error fetching notes:', err);

        if (!isActive) {
          return;
        }

        setError('Failed to load notes. Please try again.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadNotes();

    return () => {
      isActive = false;
    };
  }, [noteType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteType) {
      setError('Invalid note category.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await notesApi.create({
        title,
        content,
        type: noteType,
      });

      const savedNote = response.data;

      if (savedNote?.type !== noteType) {
        throw new Error('Saved note type did not match the current category');
      }

      setNotes((previousNotes) => [savedNote, ...previousNotes]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => setActivePage('notes')}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#c8b99a] transition-colors hover:text-[#fff8eb]"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      <div className="mb-10">
        <div className="workspace-pill mb-4">
          <NotebookPen size={14} />
          {displayCategory}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#fff8eb] sm:text-5xl">
          {displayCategory}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#c8b99a]">
          Capture and review your thoughts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-[#fff8eb] flex items-center gap-2">
              <Plus size={20} className="text-[#f3d58a]" />
              New Note
            </h2>
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8b99a]">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)] px-4 py-3 text-[#fff8eb] placeholder-[#8e8164] focus:border-[#f3d58a] focus:outline-none focus:ring-1 focus:ring-[#f3d58a]"
                  placeholder="Note title..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8b99a]">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)] px-4 py-3 text-[#fff8eb] placeholder-[#8e8164] focus:border-[#f3d58a] focus:outline-none focus:ring-1 focus:ring-[#f3d58a]"
                  placeholder="Write your thoughts here..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f3d58a] px-4 py-3 font-semibold text-[#0a1120] transition-colors hover:bg-[#e6c675] disabled:opacity-50"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </button>
            </form>
          </div>
        </div>

        {/* Notes List Section */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-[1.8rem] border border-[rgba(212,166,58,0.08)] border-dashed bg-[rgba(8,16,32,0.4)]">
              <p className="text-[#8e8164]">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-[1.8rem] border border-[rgba(212,166,58,0.08)] border-dashed bg-[rgba(8,16,32,0.4)]">
              <p className="text-[#8e8164]">{emptyMessage}</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6 md:p-8"
              >
                <h3 className="text-2xl font-bold text-[#fff8eb]">{note.title}</h3>
                <p className="mt-2 text-sm text-[#8e8164]">
                  {new Date(note.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <div className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-[#c8b99a]">
                  {note.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const NotesCategoryPage = ({ category, setActivePage, user }) => {
  const resolvedCategory = resolveNoteCategory(category);
  const displayCategory = resolvedCategory?.title || 'Notes';
  const noteType = resolvedCategory?.type || null;
  const emptyMessage = resolvedCategory?.emptyMessage || 'No notes found in this category.';

  if (noteType === 'discussion') {
    return <DiscussionRoomPage setActivePage={setActivePage} user={user} />;
  }

  return (
    <StandardNotesCategoryPage
      displayCategory={displayCategory}
      noteType={noteType}
      emptyMessage={emptyMessage}
      setActivePage={setActivePage}
    />
  );
};

export default NotesCategoryPage;
