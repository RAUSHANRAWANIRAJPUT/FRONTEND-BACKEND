import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { askLibrarian } from '../lib/ai';

const createMessage = (role, content, meta = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
  ...meta,
});

const normalizeInitialMessages = (initialMessages) => {
  if (!Array.isArray(initialMessages) || !initialMessages.length) {
    return [createMessage('assistant', 'Hello. I\'m your ReadTogether Librarian. What would you like to explore today?')];
  }

  return initialMessages.map((message) => ({
    ...message,
    id: message.id || `${message.role}-${Math.random().toString(36).slice(2, 8)}`,
  }));
};

const buildHistoryPayload = (messages) =>
  messages
    .filter((message) => ['user', 'assistant'].includes(message.role) && message.content)
    .slice(-8)
    .map((message) => ({ role: message.role, content: message.content }));

export function useAiLibrarianChat({ initialMessages = [], initialInput = '' } = {}) {
  const [messages, setMessages] = useState(() => normalizeInitialMessages(initialMessages));
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');

  const scrollAnchorRef = useRef(null);
  const activeRequestRef = useRef(null);
  const activePromptRef = useRef('');

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    scrollAnchorRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom(messages.length > 1 ? 'smooth' : 'auto');
  }, [messages, loading, error, scrollToBottom]);

  useEffect(() => () => {
    activeRequestRef.current?.abort();
  }, []);

  const sendPrompt = useCallback(
    async (rawPrompt, options = {}) => {
      const trimmedPrompt = String(rawPrompt || '').trim();
      const { includeUserMessage = true } = options;

      if (!trimmedPrompt || loading) {
        return false;
      }

      if (activePromptRef.current === trimmedPrompt) {
        return false;
      }

      const nextUserMessage = createMessage('user', trimmedPrompt);
      const nextConversation = includeUserMessage ? [...messages, nextUserMessage] : messages;
      const history = buildHistoryPayload(nextConversation);
      const requestController = new AbortController();

      activeRequestRef.current = requestController;
      activePromptRef.current = trimmedPrompt;
      setLastPrompt(trimmedPrompt);
      setError(null);
      setLoading(true);

      if (includeUserMessage) {
        setMessages((previous) => [...previous, nextUserMessage]);
        setInput('');
      }

      try {
        const payload = await askLibrarian({
          question: trimmedPrompt,
          history,
          signal: requestController.signal,
        });

        if (requestController.signal.aborted) {
          return false;
        }

        const assistantReply = String(payload.reply || '').trim();

        if (!assistantReply) {
          throw new Error('The Librarian returned an empty response.');
        }

        setMessages((previous) => [
          ...previous,
          createMessage('assistant', assistantReply, {
            source: payload.source || 'ai',
            warning: payload.warning || null,
          }),
        ]);

        return true;
      } catch (requestError) {
        if (axios.isCancel(requestError) || requestError.code === 'ERR_CANCELED') {
          setError('Generation stopped. You can retry whenever you are ready.');
          return false;
        }

        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          'The Librarian could not respond right now.';

        setError(message);
        return false;
      } finally {
        if (activeRequestRef.current === requestController) {
          activeRequestRef.current = null;
        }

        if (activePromptRef.current === trimmedPrompt) {
          activePromptRef.current = '';
        }

        setLoading(false);
      }
    },
    [loading, messages]
  );

  const retryLastPrompt = useCallback(() => {
    if (!lastPrompt || loading) {
      return false;
    }

    return sendPrompt(lastPrompt, { includeUserMessage: false });
  }, [lastPrompt, loading, sendPrompt]);

  const stopGenerating = useCallback(() => {
    if (!activeRequestRef.current) {
      return;
    }

    activeRequestRef.current.abort();
    activeRequestRef.current = null;
    activePromptRef.current = '';
    setLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const state = useMemo(
    () => ({
      messages,
      input,
      loading,
      error,
      lastPrompt,
      canRetry: Boolean(error && lastPrompt),
      scrollAnchorRef,
    }),
    [messages, input, loading, error, lastPrompt]
  );

  const actions = useMemo(
    () => ({
      setInput,
      sendPrompt,
      retryLastPrompt,
      stopGenerating,
      clearError,
      setMessages,
    }),
    [clearError, retryLastPrompt, sendPrompt, stopGenerating]
  );

  return { ...state, ...actions };
}
