import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AudioLines,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  MessageSquare,
  Mic,
  NotebookPen,
  Search,
  Send,
  Sidebar as SidebarIcon,
  Sparkles,
} from 'lucide-react';
import { workspaceBooks } from '../lib/readingWorkspaceData';

const buildStorageKey = (bookId, suffix) => `readtogether_${bookId}_${suffix}`;

const createAssistantReply = (chapterTitle, prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('summary')) {
    return `Summary for ${chapterTitle}: this section focuses on emotional clarity, the meaning behind choices, and how the chapter expands the book's central idea in a readable way.`;
  }

  if (lowerPrompt.includes('quiz')) {
    return `Quiz for ${chapterTitle}: 1. What emotional conflict shapes this chapter? 2. Which idea changes the reader's understanding most? 3. How does this section connect to the larger theme?`;
  }

  if (lowerPrompt.includes('explain')) {
    return `Difficult part explained: this chapter is less about plot complexity and more about emotional interpretation. The key is to notice how the character's choices reveal what truly matters.`;
  }

  return `For ${chapterTitle}, the most useful reading angle is to focus on theme, emotional change, and the specific details that shift the character's understanding.`;
};

const BookDetailsPage = ({ setActivePage, selectedBook }) => {
  const book = selectedBook || workspaceBooks[0];
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isChapterListOpen, setIsChapterListOpen] = useState(true);
  const [selectedChapterId, setSelectedChapterId] = useState(book.chapters[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [highlightedParagraphs, setHighlightedParagraphs] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      text: 'I am synced to your current chapter and ready to answer questions, explain difficult parts, summarize, or generate quizzes.',
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastSavedLabel, setLastSavedLabel] = useState('Not saved yet');

  const selectedChapter = useMemo(
    () => book.chapters.find((chapter) => chapter.id === selectedChapterId) || book.chapters[0],
    [book.chapters, selectedChapterId]
  );

  const filteredParagraphs = useMemo(() => {
    if (!searchTerm.trim()) {
      return selectedChapter.content;
    }

    return selectedChapter.content.filter((paragraph) =>
      paragraph.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedChapter.content]);

  useEffect(() => {
    const storedNotes = localStorage.getItem(buildStorageKey(book.id, 'notes'));
    const storedBookmarks = localStorage.getItem(buildStorageKey(book.id, 'bookmarks'));
    const storedHighlights = localStorage.getItem(buildStorageKey(book.id, 'highlights'));
    const storedProgress = localStorage.getItem(buildStorageKey(book.id, 'chapter'));

    setSavedNotes(storedNotes ? JSON.parse(storedNotes) : []);
    setBookmarks(storedBookmarks ? JSON.parse(storedBookmarks) : []);
    setHighlightedParagraphs(storedHighlights ? JSON.parse(storedHighlights) : []);
    setSelectedChapterId(storedProgress || book.chapters[0]?.id);
  }, [book]);

  useEffect(() => {
    localStorage.setItem(buildStorageKey(book.id, 'notes'), JSON.stringify(savedNotes));
    localStorage.setItem(buildStorageKey(book.id, 'bookmarks'), JSON.stringify(bookmarks));
    localStorage.setItem(buildStorageKey(book.id, 'highlights'), JSON.stringify(highlightedParagraphs));
    localStorage.setItem(buildStorageKey(book.id, 'chapter'), selectedChapterId);

    const timestamp = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date());
    setLastSavedLabel(`Auto-saved at ${timestamp}`);
  }, [book.id, bookmarks, highlightedParagraphs, savedNotes, selectedChapterId]);

  useEffect(() => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      return undefined;
    }

    const utterance = new SpeechSynthesisUtterance(selectedChapter.content.join(' '));
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [selectedChapter, voiceEnabled]);

  const handleToggleHighlight = (paragraph) => {
    setHighlightedParagraphs((current) =>
      current.includes(paragraph)
        ? current.filter((entry) => entry !== paragraph)
        : [...current, paragraph]
    );
  };

  const handleSaveNote = () => {
    const trimmed = noteDraft.trim();
    if (!trimmed) {
      return;
    }

    setSavedNotes((current) => [
      {
        id: `${Date.now()}`,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        text: trimmed,
      },
      ...current,
    ]);
    setNoteDraft('');
  };

  const handleToggleBookmark = () => {
    setBookmarks((current) =>
      current.includes(selectedChapter.id)
        ? current.filter((entry) => entry !== selectedChapter.id)
        : [...current, selectedChapter.id]
    );
  };

  const handleSendChat = (presetPrompt) => {
    const nextPrompt = (presetPrompt || chatInput).trim();
    if (!nextPrompt) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: nextPrompt,
    };

    setChatMessages((current) => [...current, userMessage]);
    setChatInput('');
    setIsAiTyping(true);

    window.setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: createAssistantReply(selectedChapter.title, nextPrompt),
        },
      ]);
      setIsAiTyping(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <button
          onClick={() => setActivePage('dashboard')}
          className="group inline-flex items-center text-sm font-semibold text-[#b8aa8d] transition-colors hover:text-[#fff8eb]"
        >
          <ChevronLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to workspace
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[rgba(212,166,58,0.16)] bg-[rgba(16,28,52,0.6)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f3d58a]">
            Streak: 12 days
          </div>
          <button
            type="button"
            onClick={() => setIsFocusMode((current) => !current)}
            className={`rounded-full border px-5 py-2 text-sm font-bold transition-all ${
              isFocusMode 
                ? 'border-[#f3d58a] bg-[#f3d58a] text-[#0d1930]' 
                : 'border-[rgba(212,166,58,0.2)] bg-[rgba(8,16,32,0.92)] text-[#fff8eb] hover:border-[rgba(212,166,58,0.4)]'
            }`}
          >
            {isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          </button>
        </div>
      </div>

      <div className={`grid gap-8 transition-all duration-500 ${isFocusMode ? 'xl:grid-cols-1 max-w-4xl mx-auto' : 'xl:grid-cols-[300px_minmax(0,1fr)_340px]'}`}>
        {!isFocusMode && (
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(13,25,48,0.96)] p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8e8164]">Book Content</p>
              <h2 className="mt-3 text-2xl font-bold text-[#fff8eb]">{book.title}</h2>
              <p className="mt-1 text-sm text-[#b8aa8d]">{book.author}</p>
              
              <div className="mt-6 space-y-2">
                {book.chapters.map((chapter, index) => {
                  const isActive = chapter.id === selectedChapter.id;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[rgba(243,213,138,0.15)] to-transparent border-l-2 border-[#f3d58a] text-[#fff8eb]' 
                          : 'text-[#8e8164] hover:text-[#fff8eb] hover:bg-white/5'
                      }`}
                    >
                      <span className="text-[10px] font-bold block mb-0.5">CHAPTER {index + 1}</span>
                      <span className="text-sm font-semibold">{chapter.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(13,25,48,0.96)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search size={16} className="text-[#f3d58a]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#8e8164]">Global Search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find in text..."
                className="w-full bg-transparent border-b border-[rgba(212,166,58,0.12)] py-2 text-sm text-[#fff8eb] outline-none placeholder:text-[#5a4820] focus:border-[#f3d58a] transition-colors"
              />
            </div>
          </motion.aside>
        )}

        <section className={`rounded-[2.5rem] border border-[rgba(212,166,58,0.14)] bg-[#0a1224] p-8 lg:p-10 shadow-2xl transition-all ${isFocusMode ? 'border-[rgba(212,166,58,0.24)]' : ''}`}>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(243,213,138,0.1)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f3d58a] mb-4">
                <Sparkles size={12} />
                Now Reading
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#fff8eb]">{selectedChapter.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                  bookmarks.includes(selectedChapter.id) 
                    ? 'border-[#f3d58a] bg-[#f3d58a] text-[#0d1930]' 
                    : 'border-[rgba(212,166,58,0.16)] text-[#f3d58a] hover:bg-white/5'
                }`}
              >
                <Bookmark size={18} />
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                  voiceEnabled 
                    ? 'border-[#60a5fa] bg-[#60a5fa] text-[#0d1930]' 
                    : 'border-[rgba(212,166,58,0.16)] text-[#60a5fa] hover:bg-white/5'
                }`}
              >
                <AudioLines size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-8 text-lg leading-relaxed text-[#d6c8a8]">
                {filteredParagraphs.map((paragraph, index) => {
                  const isHighlighted = highlightedParagraphs.includes(paragraph);
                  return (
                    <motion.p
                      key={`${selectedChapter.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleToggleHighlight(paragraph)}
                      className={`cursor-pointer rounded-2xl px-4 py-2 transition-all hover:bg-white/5 ${
                        isHighlighted 
                          ? 'bg-[rgba(243,213,138,0.15)] text-[#fff8eb] ring-1 ring-[rgba(243,213,138,0.2)]' 
                          : ''
                      }`}
                    >
                      {paragraph}
                    </motion.p>
                  );
                })}
              </div>
            </div>
            
            {!isFocusMode && (
              <div className="mt-12 border-t border-[rgba(212,166,58,0.12)] pt-10">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[2rem] border border-[rgba(212,166,58,0.08)] bg-white/5 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <NotebookPen size={18} className="text-[#f3d58a]" />
                      <h3 className="font-bold text-[#fff8eb]">Session Notes</h3>
                    </div>
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Capture a thought..."
                      className="w-full bg-transparent text-sm text-[#e5d8ba] outline-none placeholder:text-[#5a4820] h-24 resize-none"
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#5a4820] uppercase">{lastSavedLabel}</span>
                      <button 
                        onClick={handleSaveNote}
                        className="rounded-full bg-[#f3d58a] px-4 py-1.5 text-xs font-bold text-[#0d1930] hover:brightness-110"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[rgba(212,166,58,0.08)] bg-white/5 p-6">
                    <h3 className="font-bold text-[#fff8eb] mb-4">Recent Reflections</h3>
                    <div className="space-y-3">
                      {savedNotes.slice(0, 2).map((note) => (
                        <div key={note.id} className="text-xs leading-relaxed text-[#8e8164] border-l border-[rgba(212,166,58,0.2)] pl-3">
                          {note.text}
                        </div>
                      ))}
                      {!savedNotes.length && (
                        <p className="text-xs text-[#5a4820] italic">No notes for this session yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {!isFocusMode && (
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(13,25,48,0.96)] flex flex-col h-[700px] shadow-2xl">
              <div className="p-6 border-b border-[rgba(212,166,58,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(243,213,138,0.1)] text-[#f3d58a]">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#fff8eb]">AI Discussion</h2>
                    <p className="text-[10px] font-bold text-[#8e8164] uppercase tracking-widest">Live Analysis</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      msg.role === 'user' 
                        ? 'bg-[#f3d58a] text-[#0d1930] font-medium' 
                        : 'bg-white/5 border border-white/10 text-[#d6c8a8]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-[#8e8164] animate-pulse">
                      Analyzing chapter context...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[rgba(212,166,58,0.12)]">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask about this chapter..."
                    className="w-full bg-[rgba(16,28,52,0.6)] border border-[rgba(212,166,58,0.16)] rounded-2xl py-3 px-4 pr-12 text-sm text-[#fff8eb] outline-none focus:border-[#f3d58a] transition-all"
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f3d58a] hover:scale-110 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  {['Summarize', 'Explain', 'Quiz'].map(label => (
                    <button 
                      key={label}
                      onClick={() => handleSendChat(label)}
                      className="flex-1 rounded-lg border border-[rgba(212,166,58,0.08)] bg-white/5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8e8164] hover:border-[#f3d58a] hover:text-[#f3d58a] transition-all"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;

