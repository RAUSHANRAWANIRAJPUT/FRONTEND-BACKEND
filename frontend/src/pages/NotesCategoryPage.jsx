import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, NotebookPen } from 'lucide-react';

const NotesCategoryPage = ({ category, setActivePage }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fallback category if none is provided
  const displayCategory = category || 'Notes';

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/notes?category=${encodeURIComponent(displayCategory)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [displayCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5050/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category: displayCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      // Reset form and refetch
      setTitle('');
      setContent('');
      fetchNotes();
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
          {notes.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-[1.8rem] border border-[rgba(212,166,58,0.08)] border-dashed bg-[rgba(8,16,32,0.4)]">
              <p className="text-[#8e8164]">No notes found in this category.</p>
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

export default NotesCategoryPage;
