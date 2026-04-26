const axios = require('axios');
const Book = require('../models/Book');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Contributor = require('../models/Contributor');
const Message = require('../models/Message');
const { DEMO_IDS } = require('../utils/demoSeed');

// Identity & Guidelines strictly as provided by the user
const LIBRARIAN_SYSTEM_PROMPT = `
You are an AI Librarian for a platform called "ReadTogether".

Your role:
- Help users understand books deeply
- Explain themes, characters, and meanings
- Suggest books based on user interests
- Encourage thoughtful discussion

Guidelines:
- Give clear, structured, and easy-to-read answers
- Use simple but intelligent language
- Keep responses concise but insightful
- Be professional, warm, and engaging (like a book club mentor)

When answering:
- If user asks about a book → explain themes, characters, and key ideas
- If user asks for recommendations → suggest 3–5 books with short reasons
- If user asks for summary → give short and meaningful summary (no spoilers unless asked)
- If user asks questions → respond thoughtfully and encourage deeper thinking

Tone:
Friendly, knowledgeable, and inspiring — like a passionate librarian.

Always format responses cleanly with headings or bullet points.
`;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";
const DEFAULT_OPENROUTER_REFERER = "http://localhost:5173";
const RECOMMENDATION_CATALOG = [
  {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    description: 'A thoughtful sci-fi novel exploring empathy, loneliness, and artificial intelligence.',
    genre: ['Sci-Fi', 'Literary Fiction', 'AI Ethics'],
    audienceTags: ['ai', 'ethics', 'emotional', 'discussion-heavy'],
    pages: 320,
    rating: 4.7,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A sweeping nonfiction read about human history, behavior, and society.',
    genre: ['Non-Fiction', 'History', 'Psychology'],
    audienceTags: ['history', 'non-fiction', 'big-ideas', 'analysis'],
    pages: 498,
    rating: 4.8,
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    description: 'A character-rich retelling with lyrical prose and emotional depth.',
    genre: ['Fantasy', 'Mythology', 'Literary Fiction'],
    audienceTags: ['character-driven', 'mythology', 'emotional', 'literary'],
    pages: 393,
    rating: 4.6,
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Fast-paced problem solving, science-forward tension, and rewarding twists.',
    genre: ['Sci-Fi', 'Adventure', 'Science'],
    audienceTags: ['science', 'fast-paced', 'space', 'optimistic'],
    pages: 496,
    rating: 4.9,
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'A reflective novel about regret, possibility, and alternate lives.',
    genre: ['Fantasy', 'Contemporary', 'Philosophical Fiction'],
    audienceTags: ['reflective', 'discussion-heavy', 'emotional', 'philosophy'],
    pages: 304,
    rating: 4.5,
  },
];

const DEFAULT_READING_SPEED = 72;
const DEFAULT_HIGHLIGHT_USAGE = 64;
const DEFAULT_DISCUSSION_ENGAGEMENT = 78;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureRecommendationCatalog() {
  await Promise.all(
    RECOMMENDATION_CATALOG.map((book) =>
      Book.findOneAndUpdate(
        { title: book.title, author: book.author },
        { $setOnInsert: book },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );
}

async function getTargetUser(userId) {
  if (userId) {
    const explicitUser = await User.findById(userId);
    if (explicitUser) {
      return explicitUser;
    }
  }

  const demoUser = await User.findById(DEMO_IDS.elena);
  if (demoUser) {
    return demoUser;
  }

  return User.findOne().sort({ createdAt: 1 });
}

function normalizeInterestKeywords(interests = []) {
  return interests
    .flatMap((interest) => String(interest || '').toLowerCase().split(/[^a-z0-9]+/))
    .filter(Boolean);
}

function computePreferenceAlignment(book, user) {
  const interestKeywords = normalizeInterestKeywords(user.interests);
  const catalogKeywords = [...(book.genre || []), ...(book.audienceTags || [])].map((entry) => entry.toLowerCase());

  const interestMatches = interestKeywords.filter((keyword) =>
    catalogKeywords.some((entry) => entry.includes(keyword))
  ).length;

  const likedBoost = (user.likedBooks || []).some((title) => String(title).toLowerCase() === book.title.toLowerCase()) ? 16 : 0;
  const dislikedPenalty = (user.dislikedBooks || []).some((title) => String(title).toLowerCase() === book.title.toLowerCase()) ? 22 : 0;

  return clamp(48 + interestMatches * 14 + likedBoost - dislikedPenalty, 18, 100);
}

function buildRecommendationReason(book, metrics, user) {
  const reasons = [];

  if (metrics.preferenceAlignment >= 80) {
    reasons.push(`Strongly aligned with your ${user.recommendationProfile?.dominantGenres?.[0] || 'current'} reading interests`);
  }

  if (metrics.discussionEngagement >= 75 && (book.audienceTags || []).includes('discussion-heavy')) {
    reasons.push('Ideal for thoughtful discussion and deeper analysis');
  }

  if (metrics.readingSpeed >= 75 && (book.audienceTags || []).includes('fast-paced')) {
    reasons.push('Fits your faster reading rhythm with strong momentum');
  }

  if (metrics.highlightUsage >= 70 && ((book.audienceTags || []).includes('analysis') || (book.audienceTags || []).includes('philosophy'))) {
    reasons.push('Packed with ideas worth highlighting and revisiting');
  }

  if (!reasons.length) {
    reasons.push(`Balances ${book.genre?.[0] || 'storytelling'} with the themes you engage with most`);
  }

  return reasons[0];
}

async function buildRecommendationsForUser(user) {
  await ensureRecommendationCatalog();

  const [books, progressEntries, contributions, messages] = await Promise.all([
    Book.find().lean(),
    Progress.find({ userId: user._id }).lean(),
    Contributor.find({ userId: user._id }).lean(),
    Message.find({ user: user._id }).lean(),
  ]);

  const averageProgress = user.readingHistory?.length
    ? user.readingHistory.reduce((total, entry) => total + (entry.progress || 0), 0) / user.readingHistory.length
    : DEFAULT_READING_SPEED;
  const completedChapters = progressEntries.reduce(
    (total, entry) => total + (entry.completedChapters?.length || 0),
    0
  );
  const contributionPoints = contributions.reduce((total, entry) => total + (entry.points || 0), 0);

  const readingSpeed = clamp(
    Math.round(
      user.interactionStats?.readingSpeed ||
      averageProgress * 0.7 + completedChapters * 6 + 24
    ),
    35,
    100
  );
  const highlightUsage = clamp(
    Math.round(
      user.interactionStats?.highlightUsage ||
      ((user.likedBooks?.length || 1) * 10) + averageProgress * 0.45 + DEFAULT_HIGHLIGHT_USAGE * 0.28
    ),
    25,
    100
  );
  const discussionEngagement = clamp(
    Math.round(
      user.interactionStats?.discussionEngagement ||
      messages.length * 12 + contributionPoints * 0.7 + completedChapters * 4 + DEFAULT_DISCUSSION_ENGAGEMENT * 0.22
    ),
    20,
    100
  );

  const dominantGenres = Array.from(
    new Set([
      ...(user.interests || []),
      readingSpeed > 75 ? 'Sci-Fi' : 'Literary Fiction',
      discussionEngagement > 70 ? 'Philosophical Fiction' : 'Adventure',
    ])
  ).slice(0, 4);

  const recommendations = books
    .map((book) => {
      const preferenceAlignment = computePreferenceAlignment(book, user);
      const rawScore = (
        readingSpeed * 0.22 +
        highlightUsage * 0.18 +
        discussionEngagement * 0.2 +
        preferenceAlignment * 0.4
      );
      const recommendationScore = clamp(Math.round(rawScore), 55, 99);
      const metrics = {
        readingSpeed,
        highlightUsage,
        discussionEngagement,
        preferenceAlignment,
      };

      return {
        ...book,
        match: recommendationScore,
        recommendationScore,
        recommendationReason: buildRecommendationReason(book, metrics, {
          ...user.toObject(),
          recommendationProfile: { dominantGenres },
        }),
        recommendationFactors: metrics,
      };
    })
    .sort((left, right) => right.recommendationScore - left.recommendationScore);

  await Promise.all(
    recommendations.map((book) =>
      Book.findByIdAndUpdate(book._id, {
        recommendationScore: book.recommendationScore,
        recommendationReason: book.recommendationReason,
        recommendationFactors: book.recommendationFactors,
        lastRecalibratedAt: new Date(),
      })
    )
  );

  user.interactionStats = {
    readingSpeed,
    highlightUsage,
    discussionEngagement,
  };
  user.recommendationProfile = {
    dominantGenres,
    scoreBlend: {
      readingSpeed,
      highlightUsage,
      discussionEngagement,
    },
    lastCalibratedAt: new Date(),
  };
  user.likedBooks = user.likedBooks?.length ? user.likedBooks : ['Klara and the Sun', 'Project Hail Mary'];
  user.dislikedBooks = user.dislikedBooks?.length ? user.dislikedBooks : ['Sapiens'];

  await user.save();

  return {
    analytics: {
      readingSpeed,
      highlightUsage,
      discussionEngagement,
      dominantGenres,
    },
    recommendations: recommendations.slice(0, 3).map((book) => ({
      id: String(book._id),
      title: book.title,
      author: book.author,
      match: book.match,
      reason: book.recommendationReason,
      score: book.recommendationScore,
    })),
  };
}

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim().replace(/;$/, '');
  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
  const referer =
    process.env.OPENROUTER_HTTP_REFERER?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    DEFAULT_OPENROUTER_REFERER;

  return { apiKey, model, referer };
}

function hasUsableOpenRouterKey(apiKey) {
  if (!apiKey) {
    return false;
  }

  const normalizedKey = apiKey.trim().toLowerCase();

  return !['your_openrouter_api_key_here', 'your_gemini_api_key_here'].includes(normalizedKey) &&
    !normalizedKey.includes('replace_me') &&
    !normalizedKey.includes('your_');
}

function normalizeHistory(history = []) {
  return history
    .filter((entry) => entry && ['user', 'assistant'].includes(entry.role) && entry.content)
    .slice(-8)
    .map((entry) => ({
      role: entry.role,
      content: String(entry.content).trim(),
    }));
}

function buildMockLibrarianReply(question) {
  const normalizedQuestion = String(question || '').toLowerCase();

  if (normalizedQuestion.includes('recommend')) {
    return [
      'Recommended Read',
      '',
      'Try "The Midnight Library" by Matt Haig.',
      '',
      'Why it fits:',
      '- Reflective and discussion-friendly',
      '- Strong emotional themes around regret and possibility',
      '- Great for readers who like thoughtful character journeys',
    ].join('\n');
  }

  if (normalizedQuestion.includes('theme')) {
    return [
      'Theme Breakdown',
      '',
      '- Regret vs. possibility: the story explores what happens when we obsess over alternate lives.',
      '- Identity: it asks whether fulfillment comes from circumstances or from how we understand ourselves.',
      '- Hope: even painful lives can still contain meaning, connection, and renewal.',
    ].join('\n');
  }

  if (normalizedQuestion.includes('summary')) {
    return [
      'Short Summary',
      '',
      'This book follows a character who is forced to re-examine life choices, relationships, and personal meaning. The story uses that journey to turn emotional uncertainty into reflection and growth.',
    ].join('\n');
  }

  return [
    'Librarian Notes',
    '',
    'Here is a focused reading response:',
    '- Start with the emotional stakes behind the question',
    '- Look for how the author uses theme, character, and structure together',
    '- Use discussion prompts to connect the book to your own reading taste',
    '',
    `Question received: "${String(question || '').trim()}"`,
  ].join('\n');
}

function buildAskSuccessPayload(reply, source = 'openrouter', warning = null) {
  return {
    success: true,
    reply,
    source,
    ...(warning ? { warning } : {}),
  };
}

function mapLibrarianError(error) {
  const apiError = error.response?.data?.error?.message || '';

  if (error.response?.status === 401 || apiError.includes('User not found')) {
    return 'The Librarian could not verify the AI provider credentials. Please check your API key.';
  }

  if (error.response?.status === 404 || apiError.includes('No endpoints found')) {
    return 'The Librarian could not find an available AI model. Check OPENROUTER_MODEL or use the default router.';
  }

  if (error.response?.status === 429) {
    return 'The Librarian is being rate limited right now. Please retry in a moment.';
  }

  if (!error.response) {
    return 'The Librarian could not reach the AI provider. Falling back to a local reading response.';
  }

  return 'The Librarian hit an unexpected issue while preparing the answer.';
}

async function createOpenRouterChatCompletion({ apiKey, model, messages, responseFormat, referer }) {
  const payload = {
    model,
    messages,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  return axios.post(OPENROUTER_URL, payload, {
    timeout: 30000,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": "ReadTogether",
    },
  });
}

exports.askLibrarian = async (req, res) => {
  try {
    const question = String(req.body?.question || '').trim();
    const history = normalizeHistory(req.body?.history);
    const { apiKey, model, referer } = getOpenRouterConfig();

    if (!question) {
      return res.status(400).json({ success: false, message: 'A question is required for the Librarian.' });
    }

    if (!hasUsableOpenRouterKey(apiKey)) {
      return res.json(
        buildAskSuccessPayload(
          buildMockLibrarianReply(question),
          'mock',
          'Using a local fallback because the AI provider key is missing.'
        )
      );
    }

    console.log(`Librarian checking key: ${apiKey.substring(0, 8)}... (Length: ${apiKey.length})`);
    console.log(`Librarian using model: ${model}`);

    const response = await createOpenRouterChatCompletion({
      apiKey,
      model,
      referer,
      messages: [
        { role: "system", content: LIBRARIAN_SYSTEM_PROMPT },
        ...history,
        { role: "user", content: question }
      ],
    });

    const reply = response.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('OpenRouter returned an empty librarian response.');
    }

    return res.json(buildAskSuccessPayload(reply, 'openrouter'));
  } catch (error) {
    if (error.response?.data) {
      console.error('OPENROUTER FULL ERROR:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('AI Librarian Error:', error.message || error.code || 'Unknown error');
    }

    const warning = mapLibrarianError(error);

    return res.json(
      buildAskSuccessPayload(
        buildMockLibrarianReply(req.body?.question),
        'mock',
        warning
      )
    );
  }
};

exports.getDashboardSuggestions = async (req, res) => {
  try {
    const user = await getTargetUser(req.query.userId);

    if (!user) {
      return res.json({
        recommendations: [
          {
            id: 'fallback-project-hail-mary',
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            match: 94,
            reason: 'A strong fallback match for readers who love science-driven momentum.',
          },
        ],
      });
    }

    if (Array.isArray(req.query.interests) && req.query.interests.length) {
      user.interests = req.query.interests;
    }

    const payload = await buildRecommendationsForUser(user);
    res.json(payload);
  } catch (error) {
    console.error('AI Suggestions Error:', error.message);
    res.status(500).json({
      message: 'Unable to refresh tailored recommendations right now.',
      recommendations: [
        {
          id: 'fallback-the-martian',
          title: 'The Martian',
          author: 'Andy Weir',
          match: 90,
          reason: 'A reliable recommendation while the model catches up.',
        },
      ],
    });
  }
};

exports.recalibrateModel = async (req, res) => {
  try {
    const user = await getTargetUser(req.body.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found for recalibration.' });
    }

    await delay(1500);

    const payload = await buildRecommendationsForUser(user);

    return res.json({
      success: true,
      message: 'Recalibrated',
      analytics: payload.analytics,
      recommendations: payload.recommendations,
    });
  } catch (error) {
    console.error('AI Recalibration Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to recalibrate the model right now.',
    });
  }
};
