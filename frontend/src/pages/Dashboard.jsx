import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Cog,
  Flame,
  Goal,
  Library,
  NotebookPen,
  Sparkles,
} from 'lucide-react';
import BookWorkspaceCard from '../components/BookWorkspaceCard';
import WorkspaceSlider from '../components/WorkspaceSlider';

import { aiQuickSuggestions, workspaceBooks, workspaceInsights } from '../lib/readingWorkspaceData';

const dashboardCards = [
  {
    label: 'Reading streak',
    value: `${workspaceInsights.streak} days`,
    note: 'You have kept a consistent reading rhythm this week.',
    icon: Flame,
  },
  {
    label: 'Daily goal',
    value: workspaceInsights.dailyGoal,
    note: 'A realistic target designed for steady momentum.',
    icon: Goal,
  },
  {
    label: 'Smart recommendations',
    value: 'Always on',
    note: 'Suggestions adapt to your reading pace and current themes.',
    icon: BrainCircuit,
  },
];

const noteCards = [
  {
    title: 'Theme Notes',
    body: 'Track recurring ideas, motifs, and emotional shifts while you read.',
  },
  {
    title: 'Discussion Notes',
    body: 'Save talking points for your next club session without leaving the reading flow.',
  },
  {
    title: 'Personal Reflections',
    body: 'Keep a private layer of highlights, reactions, and interpretation.',
  },
];

const libraryHighlights = [
  {
    title: 'Reflective Fiction',
    text: 'Curated books built around inner conflict, regret, identity, and emotional resonance.',
  },
  {
    title: 'AI & Ethics',
    text: 'Thoughtful science fiction and literary works that explore technology and empathy.',
  },
  {
    title: 'Habit & Growth',
    text: 'Clear, useful non-fiction for routines, focus, and better reading consistency.',
  },
];

const settingsCards = [
  {
    title: 'Reading preferences',
    text: 'Adjust dark mode, focus mode, voice reading, and typography from one simple control area.',
    icon: Cog,
  },
  {
    title: 'Sync and progress',
    text: 'Keep notes, highlights, bookmarks, and reading position saved automatically across sessions.',
    icon: Sparkles,
  },
  {
    title: 'AI workspace settings',
    text: 'Refine how summaries, quizzes, explanations, and recommendation signals support your reading flow.',
    icon: BrainCircuit,
  },
];

const sectionConfig = {
  dashboard: {
    eyebrow: 'Reading Workspace',
    title: 'A modern reading dashboard designed to keep your sessions calm and focused.',
    description:
      'See your active books, next actions, goals, and AI support in one premium workspace with less clutter and stronger reading flow.',
  },
  books: {
    eyebrow: 'My Books',
    title: 'Your current reading list, organized for quick return and deeper focus.',
    description:
      'Every book stays easy to resume with progress, context, and one clear action to continue reading.',
  },
  library: {
    eyebrow: 'Library',
    title: 'A cleaner discovery space for thoughtful fiction, practical non-fiction, and smart picks.',
    description:
      'Browse by reading intent instead of noise, with recommendations shaped around your habits and interests.',
  },
  notes: {
    eyebrow: 'Notes',
    title: 'A lightweight note workspace for highlights, reflections, and discussion prep.',
    description:
      'Keep important thoughts visible and ready for review while the reading experience stays minimal.',
  },
  settings: {
    eyebrow: 'Settings',
    title: 'Clear workspace controls for reading comfort, sync, and AI support.',
    description:
      'Keep the product professional and easy to use with settings designed around focus, visibility, and continuity.',
  },
};

const Dashboard = ({ currentView = 'dashboard', onOpenBook, selectedBook, setActivePage }) => {
  const config = sectionConfig[currentView] || sectionConfig.dashboard;
  const featuredBooks = workspaceBooks;


  const renderSectionBody = () => {
    if (currentView === 'library') {
      return (
        <div className="grid gap-5 lg:grid-cols-3">
          {libraryHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[rgba(15,26,46,0.96)] text-[#f3d58a]">
                <Library size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#fff8eb]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#c8b99a]">{item.text}</p>
            </div>
          ))}
        </div>
      );
    }

    if (currentView === 'notes') {
      return (
        <div className="grid gap-5 lg:grid-cols-3">
          {noteCards.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[rgba(15,26,46,0.96)] text-[#f3d58a]">
                <NotebookPen size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#fff8eb]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#c8b99a]">{item.body}</p>
            </div>
          ))}
        </div>
      );
    }

    if (currentView === 'settings') {
      return (
        <div className="grid gap-5 lg:grid-cols-3">
          {settingsCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[rgba(15,26,46,0.96)] text-[#f3d58a]">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#fff8eb]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#c8b99a]">{item.text}</p>
              </div>
            );
          })}
        </div>
      );
    }

    if (currentView === 'dashboard') {
      return (
        <WorkspaceSlider books={workspaceBooks} onOpenBook={onOpenBook} />
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <BookWorkspaceCard book={book} onOpen={onOpenBook} />
          </motion.div>
        ))}
      </div>
    );

  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {currentView === 'dashboard' ? (
        <section className="grid gap-8 xl:grid-cols-[350px_minmax(0,1fr)]">
          {/* Dashboard Specific Sidebar Content */}
          <aside className="space-y-6">
            <div className="workspace-card rounded-[2.2rem] p-7">
              <div className="workspace-pill">
                <Sparkles size={14} />
                AI Assistant
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-[#fff8eb]">
                Refine your reading flow.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#c8b99a]">
                Get instant summaries, theme breakdowns, and quick notes.
              </p>
              <button
                type="button"
                onClick={() => setActivePage('ai')}
                className="mt-6 flex w-full items-center justify-between rounded-[1.35rem] border border-[rgba(212,166,58,0.18)] bg-[rgba(15,26,46,0.96)] px-4 py-4 text-left text-sm font-semibold text-[#fff8eb] transition-all hover:border-[rgba(212,166,58,0.32)]"
              >
                <span className="flex items-center gap-3">
                  <BrainCircuit size={18} className="text-[#f3d58a]" />
                  Ask AI Librarian
                </span>
                <ArrowRight size={16} className="text-[#f3d58a]" />
              </button>
            </div>

            <div className="workspace-card rounded-[2.2rem] p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e8164]">
                {workspaceInsights.resumeLabel}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-[#fff8eb] leading-tight">
                {selectedBook?.title || workspaceBooks[0].title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#c8b99a]">
                {selectedBook?.goal || workspaceBooks[0].goal}
              </p>
              <button
                type="button"
                onClick={() => onOpenBook?.(selectedBook || workspaceBooks[0])}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f3d58a] hover:text-[#fff8eb]"
              >
                Resume reading
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <div className="space-y-8">
            <section className="workspace-card rounded-[2.4rem] p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="workspace-pill">
                    <BookOpen size={14} />
                    Overview
                  </div>
                  <h1 className="mt-6 text-4xl font-bold tracking-[-0.06em] text-[#fff8eb] sm:text-5xl lg:leading-[1.1]">
                    Your reading <br />workspace is ready.
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-8 text-[#c8b99a]">
                    Everything you need to stay focused, track progress, and explore new ideas in one clean view.
                  </p>
                </div>

                <div className="w-full lg:w-[280px] rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e8164]">Today&apos;s Rhythm</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[1.35rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(15,26,46,0.96)] p-4">
                      <p className="text-3xl font-bold text-[#fff8eb]">{workspaceInsights.dailyGoal}</p>
                      <p className="mt-1 text-xs text-[#c8b99a]">Daily goal</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(15,26,46,0.96)] p-4">
                      <p className="text-3xl font-bold text-[#fff8eb]">{workspaceInsights.streak} days</p>
                      <p className="mt-1 text-xs text-[#c8b99a]">Current streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {renderSectionBody()}
          </div>
        </section>
      ) : (
        /* Section-Specific View (My Books, Library, etc.) */
        <div className="space-y-8 animate-in slide-in-from-top duration-500">
          <section className="workspace-card rounded-[2.4rem] p-8 lg:p-12">
            <div className="workspace-pill">
              <Sparkles size={14} />
              {config.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-[-0.06em] text-[#fff8eb] sm:text-5xl max-w-4xl">
              {config.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#c8b99a]">
              {config.description}
            </p>
          </section>

          <div className="mt-4">
            {renderSectionBody()}
          </div>
        </div>
      )}
    </div>
  );

};

export default Dashboard;
