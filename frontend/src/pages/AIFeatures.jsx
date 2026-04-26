import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  BookText,
  BrainCircuit,
  Compass,
  MessageSquare,
  Quote,
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AiLibrarianChat from '../components/AiLibrarianChat';
import ShareButton from '../components/ShareButton';
import SmartAnalysisCard from '../components/SmartAnalysisCard';
import { fallbackRecommendations, fetchTailoredRecommendations } from '../lib/ai';

const suggestedQuestions = [
  "What are the major themes in 'The Midnight Library'?",
  'Recommend a reflective novel similar to Circe.',
  'Help me understand why this book fits my taste profile.',
];

const chatSuggestionCards = [
  {
    title: 'Theme Breakdown',
    description: 'Get a clean explanation of the ideas, emotional arc, and symbolism in a book.',
    prompt: "Break down the main themes in 'The Midnight Library' in a simple way.",
    icon: BrainCircuit,
  },
  {
    title: 'Smart Recommendation',
    description: 'Ask for your next read based on tone, genre, or how a recommendation was chosen.',
    prompt: 'Recommend a thoughtful novel similar to Circe and explain why it fits me.',
    icon: Sparkles,
  },
  {
    title: 'Discussion Prompt',
    description: 'Generate stronger questions for a reading circle or book club session.',
    prompt: 'Give me 5 strong book club discussion questions for Klara and the Sun.',
    icon: MessageSquare,
  },
];

const summaryCards = [
  {
    title: 'Chapter 1 Summary',
    chapter: 'Intro & Setup',
    icon: BookText,
    description: 'A grounded entry into the story world, introducing tension, emotional stakes, and the central question.',
    bullets: ['Clear scene-setting and tone', 'Introduces the emotional conflict', 'Plants motifs that return later'],
  },
  {
    title: 'Character Arc Snapshot',
    chapter: 'Lead Character',
    icon: Sparkles,
    description: 'Tracks how the protagonist shifts from uncertainty into self-awareness through conflict and reflection.',
    bullets: ['Motivation becomes sharper', 'Relationships drive the turning point', 'Internal growth mirrors the plot'],
  },
  {
    title: 'Theme Analysis',
    chapter: 'Core Ideas',
    icon: BrainCircuit,
    description: 'Connects the book to larger ideas like regret, identity, ambition, and emotional resilience.',
    bullets: ['Useful for essays and notes', 'Easy to discuss in clubs', 'Highlights meaningful quotes and patterns'],
  },
];

const capabilityCards = [
  {
    title: 'Recommendation Engine',
    text: 'Uses reading rhythm, highlights, and book discussions to keep suggestions relevant.',
    icon: Compass,
  },
  {
    title: 'Discussion',
    text: 'Turns book club context into stronger follow-up questions and deeper prompts.',
    icon: MessageSquare,
  },
  {
    title: 'Theme Guidance',
    text: 'Explains motifs, symbolism, and character motivation in a clear, readable format.',
    icon: Quote,
  },
];

const tabLabels = {
  recommend: 'Recommendations',
  summaries: 'Summaries',
  ask: 'Ask Librarian',
};

const initialChatMessages = [
  {
    role: 'assistant',
    content:
      "Hello. I'm your ReadTogether Librarian.\n\nI'm ready to help with theme analysis, recommendation logic, summaries, and discussion prompts.\n\nWhat would you like to explore today?",
  },
];

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('recommend');
  const [recommendations, setRecommendations] = useState(fallbackRecommendations);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsRecommendationsLoading(true);

      try {
        const nextRecommendations = await fetchTailoredRecommendations();
        setRecommendations(nextRecommendations);
      } catch (error) {
        setRecommendations(fallbackRecommendations);
        toast.error(error.response?.data?.message || 'Unable to load tailored recommendations right now.');
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="workspace-card rounded-[2rem] p-8 lg:p-10">
          <div className="workspace-pill">
            <BookOpen size={14} />
            AI Reading Workspace
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[#f8fbff] sm:text-5xl lg:text-6xl">
            A clean AI workspace for reading, reflection, and discovery.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#a7b4cb] sm:text-lg">
            ReadTogether brings recommendations, summaries, and discussion support into one focused interface with
            quieter visuals and better reading ergonomics.
          </p>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row">
            <button
              type="button"
              onClick={() => setActiveTab('recommend')}
              className="btn-secondary h-14 whitespace-nowrap"
            >
              View Recommendations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('summaries')}
              className="btn-secondary h-14 whitespace-nowrap"
            >
              Explore Summaries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ask')}
              className="btn-primary h-14 whitespace-nowrap"
            >
              Open Librarian Chat
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setActiveTab('ask')}
                className="rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-4 py-2 text-sm text-[#a7b4cb] transition-all hover:border-[rgba(111,144,255,0.28)] hover:text-[#f8fbff]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Personal Match Quality', value: '94%', note: 'adaptive recommendation fit' },
              { label: 'Discussion Context', value: 'Live', note: 'club-aware insight' },
              { label: 'Summaries & Analysis', value: 'Instant', note: 'clear, structured answers' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#7588a9]">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#f8fbff]">{item.value}</p>
                <p className="mt-2 text-sm text-[#93a6c4]">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {capabilityCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="workspace-card rounded-[1.75rem] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#f8fbff]">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#93a6c4]">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] p-1.5">
          {Object.keys(tabLabels).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-[0_10px_24px_rgba(54,83,199,0.24)]'
                  : 'text-[#92a4c0] hover:text-[#f8fbff]'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {activeTab === 'recommend' && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7588a9]">Tailored For You</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#f8fbff]">
                    Recommendations with clear reasoning
                  </h2>
                </div>
                <div className="workspace-pill">Based on reading behavior, highlights, and discussions</div>
              </div>

              {isRecommendationsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`recommendation-skeleton-${index}`}
                    className="overflow-hidden rounded-[1.75rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] p-6"
                  >
                    <div className="flex gap-5">
                      <div className="h-28 w-20 animate-pulse rounded-2xl bg-[#16233e]" />
                      <div className="flex-1 space-y-4">
                        <div className="h-4 w-40 animate-pulse rounded-full bg-[#16233e]" />
                        <div className="h-3 w-28 animate-pulse rounded-full bg-[#16233e]" />
                        <div className="h-5 w-20 animate-pulse rounded-full bg-[#16233e]" />
                        <div className="h-16 w-full animate-pulse rounded-[1.25rem] bg-[#16233e]" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="overflow-hidden rounded-[1.85rem] border border-[rgba(166,186,220,0.16)] bg-[linear-gradient(180deg,rgba(12,22,42,0.98),rgba(7,14,28,0.98))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                      <div className="h-32 w-24 shrink-0 overflow-hidden rounded-[1.35rem] border border-[rgba(166,186,220,0.16)] bg-[#0c162c]">
                        <img
                          src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=280&sig=${index}`}
                          alt={rec.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f8fbff]">{rec.title}</h3>
                            <p className="mt-1 text-sm text-[#92a4c0]">{rec.author}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="rounded-full border border-[rgba(111,144,255,0.24)] bg-[rgba(16,28,52,0.94)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#a9c2ff]">
                              {rec.match}% Match
                            </div>
                            <ShareButton book={rec} />
                          </div>
                        </div>

                        <div className="mt-4 rounded-[1.3rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] p-4">
                          <p className="text-sm leading-7 text-[#aab8d0]">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="space-y-5">
              <div className="workspace-card rounded-[1.85rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
                    <BrainCircuit size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7588a9]">Model Inputs</p>
                    <h3 className="mt-1 text-xl font-semibold text-[#f8fbff]">Why these books rise to the top</h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { label: 'Reading speed fit', value: '91%' },
                    { label: 'Highlight relevance', value: '87%' },
                    { label: 'Discussion alignment', value: '94%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[#aab8d0]">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#16233e]">
                        <div className="h-2 rounded-full bg-primary-500" style={{ width: item.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SmartAnalysisCard
                onRecommendationsUpdated={(nextRecommendations) => {
                  setRecommendations(nextRecommendations);
                  setIsRecommendationsLoading(false);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'summaries' && (
          <div>
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7588a9]">Summaries</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#f8fbff]">
                Structured insight that stays easy to scan
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="workspace-card rounded-[1.75rem] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#92a4c0]">
                        {card.chapter}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[#f8fbff]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#93a6c4]">{card.description}</p>
                    <div className="mt-6 space-y-3">
                      {card.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3 text-sm text-[#aab8d0]">
                          <Zap size={14} className="mt-1 shrink-0 text-[#a9c2ff]" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a9c2ff] transition-colors hover:text-[#f8fbff]">
                      Read Full Synthesis
                      <ArrowUpRight size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'ask' && (
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="workspace-card rounded-[1.85rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7588a9]">Guidelines</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#f8fbff]">How the Librarian helps</h3>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      heading: 'Best use cases',
                      items: ['Explain themes and symbolism', 'Connect books to your taste signals', 'Create stronger book club prompts'],
                    },
                    {
                      heading: 'Response style',
                      items: ['Structured and readable', 'Professional and warm', 'Written for fast scanning'],
                    },
                  ].map((section) => (
                    <div key={section.heading}>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7588a9]">{section.heading}</p>
                      <div className="mt-3 space-y-2">
                        {section.items.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#aab8d0]">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#a9c2ff]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="workspace-card rounded-[1.85rem] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7588a9]">Start Fast</p>
                <h3 className="mt-2 text-lg font-semibold text-[#f8fbff]">Suggested prompts</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {suggestedQuestions.map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-4 py-2 text-left text-sm text-[#a7b4cb]"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AiLibrarianChat
              title="AI Librarian"
              subtitle="Discuss themes, match logic, summaries, and interpretation."
              initialMessages={initialChatMessages}
              promptChips={suggestedQuestions}
              suggestionCards={chatSuggestionCards}
              inputPlaceholder="Ask about themes, characters, recommendations, or discussion angles..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeatures;
