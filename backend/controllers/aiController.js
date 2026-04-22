const axios = require('axios');

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

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim().replace(/;$/, '');
  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;

  return { apiKey, model };
}

async function createOpenRouterChatCompletion({ apiKey, model, messages, responseFormat }) {
  const payload = {
    model,
    messages,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  return axios.post(OPENROUTER_URL, payload, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5000",
      "X-Title": "ReadTogether",
    },
  });
}

exports.askLibrarian = async (req, res) => {
  try {
    const { question } = req.body;
    const { apiKey, model } = getOpenRouterConfig();

    if (!question) {
      return res.status(400).json({ message: 'A question is required for the Librarian.' });
    }

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ 
        message: 'Librarian is currently offline (API Key missing). Please check the backend .env configuration.' 
      });
    }

    // Diagnostic log: masked key
    console.log(`Librarian checking key: ${apiKey.substring(0, 8)}... (Length: ${apiKey.length})`);
    console.log(`Librarian using model: ${model}`);

    const response = await createOpenRouterChatCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: LIBRARIAN_SYSTEM_PROMPT },
        { role: "user", content: question }
      ],
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    if (error.response?.data) {
      console.error('OPENROUTER FULL ERROR:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('AI Librarian Error:', error.message);
    }
    
    let userMessage = 'The Librarian is looking for the right book and will be back in a moment.';
    const apiError = error.response?.data?.error?.message || '';
    
    if (error.response?.status === 401 || apiError.includes('User not found')) {
      userMessage = 'The Librarian says your API Key is invalid or not found on OpenRouter. Please verify your key at openrouter.ai.';
    } else if (error.response?.status === 404 || apiError.includes('No endpoints found')) {
      userMessage = 'The Librarian could not find an available AI model. Check OPENROUTER_MODEL or use the default openrouter/free router.';
    }

    res.status(500).json({ message: userMessage });
  }
};

exports.getDashboardSuggestions = async (req, res) => {
  try {
    const { interests = ['Sci-Fi', 'Molecular Biology'] } = req.query;
    const { apiKey, model } = getOpenRouterConfig();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.json({
        title: "Project Hail Mary",
        author: "Andy Weir",
        reason: "Based on your interest in Sci-Fi and Molecular Biology.",
        offline: true
      });
    }

    const prompt = `
      You are an AI Librarian. Based on the following user interests: ${interests.join(', ')}, suggest ONE book they would enjoy.
      Return the response in this EXACT JSON format:
      {
        "title": "Book Title",
        "author": "Author Name",
        "reason": "A very short one-sentence reason why they will like it based on their interests."
      }
    `;

    const response = await createOpenRouterChatCompletion({
      apiKey,
      model,
      messages: [
        { role: "user", content: prompt }
      ],
      responseFormat: { type: "json_object" },
    });

    const text = response.data.choices[0].message.content;
    const suggestion = JSON.parse(text);

    res.json(suggestion);
  } catch (error) {
    if (error.response?.data) {
      console.error('AI SUGGESTIONS ERROR details:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('AI Suggestions Error:', error.message);
    }
    res.json({
      title: "The Martian",
      author: "Andy Weir",
      reason: "A classic sci-fi recommendation for you.",
      error: true
    });
  }
};
