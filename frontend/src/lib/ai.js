import { apiClient } from './api';

const fallbackRecommendations = [
  {
    id: 'fallback-klara-and-the-sun',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    match: 98,
    reason: 'Matches your interest in AI ethics and emotional sci-fi.',
  },
  {
    id: 'fallback-sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    match: 92,
    reason: 'Based on your frequent reading of non-fiction history.',
  },
  {
    id: 'fallback-circe',
    title: 'Circe',
    author: 'Madeline Miller',
    match: 85,
    reason: "Similar narrative style to 'The Midnight Library'.",
  },
];

const normalizeRecommendation = (book) => ({
  id: book.id ?? book._id ?? `${book.title}-${book.author}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title: book.title,
  author: book.author,
  match: Number(book.match ?? book.score ?? 0),
  reason: book.reason ?? book.recommendationReason ?? 'Recommended for your reading profile.',
});

export async function askLibrarian({ question, history = [], signal } = {}) {
  const response = await apiClient.post(
    '/ask',
    { question, history },
    {
      signal,
      timeout: 35000,
      skipBaseUrlFallback: true,
    }
  );

  const success = response.data?.success;
  const reply = response.data?.reply ?? response.data?.answer;

  if (!success || !reply) {
    const error = new Error(response.data?.message || 'The Librarian returned an unexpected response.');
    error.response = response;
    throw error;
  }

  return {
    reply,
    source: response.data?.source ?? 'ai',
    warning: response.data?.warning ?? null,
  };
}

export async function fetchTailoredRecommendations(userId) {
  try {
    const response = await apiClient.get('/ai/suggestions', {
      params: userId ? { userId } : undefined,
    });

    const recommendations = Array.isArray(response.data?.recommendations)
      ? response.data.recommendations.map(normalizeRecommendation)
      : fallbackRecommendations;

    return recommendations.length ? recommendations : fallbackRecommendations;
  } catch (error) {
    console.warn('Falling back to local recommendations:', error.message);
    return fallbackRecommendations;
  }
}

export async function recalibrateRecommendationModel(userId) {
  const response = await apiClient.post('/ai/recalibrate', userId ? { userId } : {});

  return {
    message: response.data?.message ?? 'Recalibrated',
    recommendations: Array.isArray(response.data?.recommendations)
      ? response.data.recommendations.map(normalizeRecommendation)
      : fallbackRecommendations,
    analytics: response.data?.analytics ?? null,
  };
}

export { fallbackRecommendations };
