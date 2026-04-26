import React from 'react';
import { motion } from 'framer-motion';
import {
  BookMarked,
  BrainCircuit,
  LayoutDashboard,
  Library,
  LogOut,
  NotebookPen,
  Settings,
  Sparkles,
} from 'lucide-react';
import { aiQuickSuggestions } from '../lib/readingWorkspaceData';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'clubs', name: 'My Books', icon: BookMarked },
  { id: 'library', name: 'Library', icon: Library },
  { id: 'notes', name: 'Notes', icon: NotebookPen },
  { id: 'profile', name: 'Settings', icon: Settings },
];

const Sidebar = ({ activePage, setActivePage, onSignOut, user }) => {
  const activeIndex = navItems.findIndex(item => item.id === activePage);

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col border-r border-[rgba(212,166,58,0.12)] bg-[rgba(6,12,24,0.98)] px-7 py-8">
      <div className="mb-8 flex cursor-pointer items-center gap-4 px-1" onClick={() => setActivePage('landing')}>
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.18)] bg-[linear-gradient(180deg,rgba(16,28,52,0.98),rgba(7,14,28,0.98))] text-base font-bold text-[#f3d58a]">
          RT
        </div>
        <div>
          <span className="block text-xl font-bold tracking-[-0.03em] text-[#fff8eb]">ReadTogether</span>
          <span className="block text-xs uppercase tracking-[0.28em] text-[#8b7f68]">Reading OS</span>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(212,166,58,0.12)] to-transparent mb-8" />

      {/* AI Librarian Quick Access */}
      <div className="mb-10 rounded-[2.2rem] border border-[rgba(212,166,58,0.16)] bg-[linear-gradient(180deg,rgba(12,22,42,0.98),rgba(8,16,32,0.98))] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[rgba(15,26,46,0.96)] text-[#f3d58a]">
            <BrainCircuit size={20} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e8164]">AI Librarian</p>
            <h3 className="mt-1 text-lg font-bold text-[#fff8eb]">Reading assistant</h3>
          </div>
        </div>
        
        <div className="h-px w-full bg-[rgba(212,166,58,0.1)] mb-6" />

        <button
          type="button"
          onClick={() => setActivePage('ai')}
          className="flex w-full items-center justify-between rounded-[1.4rem] border border-[rgba(212,166,58,0.16)] bg-[rgba(8,16,32,0.92)] px-5 py-4 text-sm font-semibold text-[#fff8eb] transition-all hover:border-[rgba(212,166,58,0.32)] shadow-lg"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(212,166,58,0.1)] text-[#f3d58a]">
              <Sparkles size={18} />
            </span>
            Ask AI
          </span>
          <span className="text-[#f3d58a]">Open</span>
        </button>
      </div>

      <div className="mb-4 px-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#8f805f]">
        Workspace
      </div>

      <div className="relative flex-1 space-y-2 overflow-y-auto pr-1">
        {/* Glowing Indicator Strip */}
        {activeIndex !== -1 && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute right-0 w-1 rounded-full bg-gradient-to-b from-[#f3d58a] to-[#406097] shadow-[0_0_12px_rgba(243,213,138,0.6)]"
            initial={false}
            animate={{
              top: activeIndex * 60 + 8, // Roughly matches the button height + gap
              height: 44,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`group relative flex h-[58px] w-full items-center justify-between rounded-2xl px-5 py-4 transition-all ${
                isActive
                  ? 'border border-[rgba(212,166,58,0.24)] bg-[rgba(16,28,52,0.94)] text-[#f8fbff] shadow-[0_12px_28px_rgba(0,0,0,0.24)]'
                  : 'border border-transparent text-[#b9ac8f] hover:border-[rgba(212,166,58,0.12)] hover:bg-[rgba(10,18,36,0.88)] hover:text-[#f8fbff]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-[#f3d58a]' : 'text-[#8b7f68] group-hover:text-[#f3d58a]'} />
                <span className="text-sm font-semibold">{item.name}</span>
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-[#8e8164]`}>
                Open
              </span>
            </button>
          );
        })}
      </div>



        <button
          type="button"
          onClick={onSignOut}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#b9ac8f] transition-colors hover:bg-[rgba(10,18,36,0.88)] hover:text-[#f8fbff]"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
    </aside>
  );
};

export default Sidebar;

