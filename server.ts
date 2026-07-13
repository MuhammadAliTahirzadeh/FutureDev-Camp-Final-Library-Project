import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crash if key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY env variable is not set. AI Librarian will run in simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'MOCK_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// AI LIBRARIAN ENDPOINTS (Clean Architecture APIs)
// ----------------------------------------------------

// Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Simulate response if no API key is provided
      const simulations = [
        "Hello! I am Libra, your AI Librarian. I see you are reading 'The Midnight Library'. It is a wonderful choice about life possibilities. Let me know if you need any recommendations in Fiction or Sci-Fi!",
        "Based on your interest in 'Atomic Habits', you might also enjoy 'Quiet' by Susan Cain or 'Deep Work' by Cal Newport. Would you like me to find them in the catalog for you?",
        "Our digital archive currently has 512 active members. As an AI librarian, I can help you search, borrow, or renew your upcoming books. Just ask!",
        "To maintain your 14-day reading streak, try setting a reminder in Settings. Consistency is key to unlocking your next achievement badge!",
      ];
      const randomReply = simulations[Math.floor(Math.random() * simulations.length)];
      return res.json({ text: randomReply, isSimulated: true });
    }

    const ai = getAiClient();
    const systemPrompt = `You are Libra, the intelligent AI Librarian of the LIBRA Library Management System. 
Your tone should be helpful, warm, professional, and knowledgeable.
You can recommend books, discuss genres, assist with library policies, and suggest reading techniques.
Keep your answers relatively concise, polite, and directly address the user's question. 
Reference actual books in our catalog when relevant (such as 'The Midnight Library', 'Atomic Habits', 'Project Hail Mary', 'Dune', 'Sapiens', 'Quiet', '1984', 'To Kill a Mockingbird').`;

    // Map history to contents structure
    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm sorry, I couldn't formulate a response right now. Please try again.";
    res.json({ text: replyText, isSimulated: false });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// AI Book Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { interests, currentReading } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return beautiful mock recommendations
      return res.json({
        recommendations: [
          { title: "Deep Work", author: "Cal Newport", reason: "Because you like productivity titles like Atomic Habits." },
          { title: "Foundation", author: "Isaac Asimov", reason: "Since you are interested in Sci-Fi masterpieces like Dune." },
          { title: "The Humans", author: "Matt Haig", reason: "From the author of The Midnight Library, exploring human nature with humor." }
        ],
        isSimulated: true
      });
    }

    const ai = getAiClient();
    const prompt = `Give me 3 book recommendations for a library member.
Interests: ${interests ? interests.join(', ') : 'General reading'}.
Currently reading: ${currentReading ? currentReading.join(', ') : 'None'}.

Provide the response in raw JSON format matching this schema:
{
  "recommendations": [
    { "title": "Book Title", "author": "Author Name", "reason": "Short explanation of why this book matches their interests." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const text = response.text || '{"recommendations":[]}';
    const parsedData = JSON.parse(text.trim());
    res.json({ ...parsedData, isSimulated: false });
  } catch (error: any) {
    console.error('Error in AI Recommendations:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// ----------------------------------------------------
// STATIC OR VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LIBRA FSD] Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

initializeServer();
