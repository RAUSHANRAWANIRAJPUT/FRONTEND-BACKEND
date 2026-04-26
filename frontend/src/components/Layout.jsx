import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, BookOpen, FileText, HelpCircle, Lightbulb, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import AiLibrarianChat from './AiLibrarianChat';

const panelSuggestionCards = [
  {
    title: 'Summarize',
    description: 'Get a spoiler-safe summary with the main emotional and thematic beats.',
    prompt: "Give me a short spoiler-free summary of 'The Midnight Library'.",
    icon: FileText,
  },
  {
    title: 'Explain',
    description: 'Clarify major themes, symbolism, or confusing moments in plain language.',
    prompt: "Explain the main themes in 'The Midnight Library' in simple language.",
    icon: Lightbulb,
  },
  {
    title: 'Book Club Prompt',
    description: 'Generate thoughtful discussion prompts for a reading circle session.',
    prompt: 'Give me 5 strong book club discussion questions for Klara and the Sun.',
    icon: BrainCircuit,
  },
  {
    title: 'Quick Quiz',
    description: 'Create a short knowledge check based on a chapter or full book.',
    prompt: 'Create a quick 5-question quiz about the current book.',
    icon: HelpCircle,
  },
];

const panelPromptChips = ['Identify main themes', 'Character analysis', 'Vocabulary help'];

const panelInitialMessages = [
  {
    role: 'assistant',
    content:
      "I can help you understand themes, explain tricky chapters, and suggest what to read next. Ask me anything about your reading.",
  },
];

const AiLibrarianPanel = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 z-[70] w-full max-w-[560px] border-r border-[rgba(212,166,58,0.2)] bg-[#070d1a] shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[rgba(212,166,58,0.12)] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3d58a] to-[#c8941d] text-[#0d1930]">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#fff8eb]">AI Librarian</h2>
                  <p className="text-xs text-[#8e8164]">Always ready to assist</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-[#8e8164] hover:bg-white/5 hover:text-[#fff8eb]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <AiLibrarianChat
                title="Reading Assistant"
                subtitle="Summaries, theme breakdowns, discussion prompts, and quick reading support."
                initialMessages={panelInitialMessages}
                promptChips={panelPromptChips}
                suggestionCards={panelSuggestionCards}
                inputPlaceholder="Ask the librarian..."
                typingLabel="The Librarian is thinking..."
                compact
              />
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Layout = ({ children, activePage, setActivePage, onOpenApiSettings, onSignOut, onOpenAuth, user }) => {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 600) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);
  const workspacePages = ['dashboard', 'clubs', 'library', 'notes', 'book-details', 'ai', 'profile'];
  const isWorkspacePage = workspacePages.includes(activePage);
  const pageTitles = {
    dashboard: 'Dashboard',
    clubs: 'My Books',
    library: 'Library',
    notes: 'Notes',
    'book-details': 'Focused reading environment',
    ai: 'AI Reading Workspace',
    profile: 'Settings',
  };

  return (
    <div className="app-shell flex min-h-screen">
      <AiLibrarianPanel isOpen={isAiPanelOpen} onClose={() => setIsAiPanelOpen(false)} />

      <div 
        className={isWorkspacePage ? 'hidden lg:block' : 'hidden'}
        style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}
      >
        <Sidebar activePage={activePage} setActivePage={setActivePage} onSignOut={onSignOut} user={user} />
      </div>

      {isWorkspacePage && (
        <div 
          className={`resizer ${isResizing ? 'resizing' : ''}`}
          onMouseDown={startResizing}
          onClick={() => {
            if (!isResizing) setIsAiPanelOpen(true);
          }}
        >
          <div className="resizer-visual" />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className={isWorkspacePage ? 'lg:hidden sticky top-0 z-40' : 'sticky top-0 z-40'}>
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            onOpenApiSettings={onOpenApiSettings}
            onSignOut={onSignOut}
            onOpenAuth={onOpenAuth}
            isWorkspacePage={isWorkspacePage}
            user={user}
          />
        </header>

        <div className={isWorkspacePage ? 'hidden lg:flex items-center justify-between px-8 py-6' : 'hidden'}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7588a9]">
              {isWorkspacePage ? 'ReadTogether Workspace' : 'ReadTogether'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f8fbff]">
              {pageTitles[activePage] || 'Focused reading environment'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(166,186,220,0.12)] bg-[rgba(10,18,36,0.6)] px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-[#f3d58a] animate-pulse" />
              <span className="text-xs font-medium text-[#a7b4cb]">System Online</span>
            </div>
            <button
              onClick={() => setActivePage('landing')}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[linear-gradient(180deg,rgba(16,28,52,0.98),rgba(7,14,28,0.98))] text-sm font-semibold text-[#f3d58a] hover:border-[rgba(212,166,58,0.3)] transition-all"
            >
              RT
            </button>
          </div>
        </div>


        <main className="flex-grow">{children}</main>

        {!isWorkspacePage ? <Footer /> : null}
      </div>
    </div>
  );
};

export default Layout;
