import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, LoaderCircle, RotateCcw, Send, Sparkles, Square } from 'lucide-react';
import { useAiLibrarianChat } from '../hooks/useAiLibrarianChat';

const defaultInitialMessages = [
  {
    role: 'assistant',
    content:
      "Hello. I'm your ReadTogether Librarian.\n\nI'm ready to help with theme analysis, recommendation logic, summaries, and discussion prompts.\n\nWhat would you like to explore today?",
  },
];

const TypingIndicator = ({ label = 'The Librarian is preparing a focused answer...' }) => (
  <div className="flex items-end gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
      <Sparkles size={18} />
    </div>
    <div className="rounded-[1.6rem] rounded-bl-md border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-5 py-4 text-sm text-[#aab8d0] shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#a9c2ff] [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#a9c2ff] [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#a9c2ff]" />
        </div>
        <span>{label}</span>
      </div>
    </div>
  </div>
);

const suggestionCardBaseClass =
  'rounded-[1.35rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(7,14,28,0.92)] p-4 text-left transition-all hover:border-[rgba(111,144,255,0.28)] disabled:cursor-not-allowed disabled:opacity-60';

function MessageBubble({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-3 ${isAssistant ? '' : 'justify-end'}`}
    >
      {isAssistant && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
          <Sparkles size={18} />
        </div>
      )}

      <div className="max-w-[85%]">
        <div
          className={`rounded-[1.6rem] border px-5 py-4 text-sm leading-7 shadow-[0_16px_34px_rgba(0,0,0,0.18)] ${
            isAssistant
              ? 'rounded-bl-md border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] text-[#e5ecfb]'
              : 'rounded-br-md border-[rgba(111,144,255,0.22)] bg-primary-600 text-white'
          }`}
        >
          <div className="whitespace-pre-line">{message.content}</div>
        </div>

        {isAssistant && message.warning && (
          <p className="mt-2 pl-2 text-xs text-[#92a4c0]">
            Note: {message.warning}
          </p>
        )}
      </div>
    </motion.div>
  );
}

const AiLibrarianChat = ({
  title = 'AI Librarian',
  subtitle = 'Discuss themes, summaries, recommendations, and interpretation.',
  initialMessages = defaultInitialMessages,
  promptChips = [],
  suggestionCards = [],
  inputPlaceholder = 'Ask about themes, characters, recommendations, or discussion angles...',
  typingLabel = 'The Librarian is preparing a focused answer...',
  compact = false,
}) => {
  const {
    messages,
    input,
    loading,
    error,
    canRetry,
    scrollAnchorRef,
    setInput,
    sendPrompt,
    retryLastPrompt,
    stopGenerating,
    clearError,
  } = useAiLibrarianChat({ initialMessages });

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[rgba(166,186,220,0.16)] bg-[linear-gradient(180deg,rgba(12,22,42,0.98),rgba(7,14,28,0.98))] shadow-[0_22px_54px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 border-b border-[rgba(166,186,220,0.12)] bg-[rgba(8,16,32,0.92)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7588a9]">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#f8fbff]">
              Deep, readable book guidance
            </h3>
            <p className="mt-1 text-sm text-[#92a4c0]">{subtitle}</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a9c2ff]">
          <span className="h-2 w-2 rounded-full bg-[#a9c2ff]" />
          Online
        </div>
      </div>

      <div className={`${compact ? 'h-[420px]' : 'h-[480px]'} space-y-6 overflow-y-auto bg-[rgba(7,14,28,0.94)] p-6`}>
        {messages.length === 1 && suggestionCards.length > 0 && (
          <div className="rounded-[1.75rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7588a9]">Prompt Shortcuts</p>
                <h4 className="mt-2 text-lg font-semibold text-[#f8fbff]">Start from a stronger question</h4>
              </div>
              <div className="rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(7,14,28,0.92)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#92a4c0]">
                Click to send
              </div>
            </div>

            <div className={`mt-5 grid gap-3 ${compact ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
              {suggestionCards.map((card) => {
                const Icon = card.icon;

                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => sendPrompt(card.prompt)}
                    disabled={loading}
                    className={suggestionCardBaseClass}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(12,22,42,0.95)] text-[#a9c2ff]">
                      <Icon size={18} />
                    </div>
                    <h5 className="mt-4 text-base font-semibold text-[#f8fbff]">{card.title}</h5>
                    <p className="mt-2 text-sm leading-6 text-[#93a6c4]">{card.description}</p>
                    <p className="mt-4 text-xs leading-5 text-[#92a4c0]">"{card.prompt}"</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && <TypingIndicator label={typingLabel} />}

        {error && (
          <div className="rounded-[1.4rem] border border-[rgba(255,166,166,0.18)] bg-[rgba(42,14,22,0.88)] p-4 text-sm text-[#ffd8d8]">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="leading-6">{error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {canRetry && (
                    <button
                      type="button"
                      onClick={retryLastPrompt}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,216,216,0.16)] px-3 py-1.5 text-xs font-semibold text-[#fff1f1] transition hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <RotateCcw size={14} />
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearError}
                    className="rounded-full border border-[rgba(255,216,216,0.16)] px-3 py-1.5 text-xs font-semibold text-[#ffd8d8] transition hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollAnchorRef} />
      </div>

      <div className="border-t border-[rgba(166,186,220,0.12)] bg-[rgba(8,16,32,0.92)] p-5">
        {promptChips.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {promptChips.map((prompt) => (
              <button
                key={`chip-${prompt}`}
                type="button"
                onClick={() => sendPrompt(prompt)}
                disabled={loading}
                className="rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(7,14,28,0.92)] px-3 py-1.5 text-xs text-[#92a4c0] transition-all hover:border-[rgba(111,144,255,0.28)] hover:text-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-[#7f92b3]">
            {loading ? 'Generating a response...' : 'Press Enter to send'}
          </div>
          <div className="flex flex-wrap gap-2">
            {canRetry && !loading && (
              <button
                type="button"
                onClick={retryLastPrompt}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(166,186,220,0.16)] px-3 py-1.5 text-xs font-semibold text-[#d7e3f8] transition hover:bg-[rgba(255,255,255,0.04)]"
              >
                <RotateCcw size={14} />
                Retry
              </button>
            )}
            {loading && (
              <button
                type="button"
                onClick={stopGenerating}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,214,153,0.18)] px-3 py-1.5 text-xs font-semibold text-[#ffe2b7] transition hover:bg-[rgba(255,255,255,0.04)]"
              >
                <Square size={12} fill="currentColor" />
                Stop generating
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[rgba(166,186,220,0.16)] bg-[rgba(7,14,28,0.92)] p-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendPrompt(input);
              }
            }}
            disabled={loading}
            placeholder={inputPlaceholder}
            className="h-12 flex-1 rounded-[1rem] border border-transparent bg-transparent px-4 text-sm text-[#f8fbff] outline-none placeholder:text-[#7385a6] focus:border-[rgba(166,186,220,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => sendPrompt(input)}
            disabled={loading || !input.trim()}
            className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-primary-600 px-6 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(54,83,199,0.24)] transition-all hover:translate-y-[-1px] hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiLibrarianChat;
