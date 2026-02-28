const { GoogleGenAI } = require("@google/genai");

// Note: Ensure GEMINI_API_KEY is set in Vercel environment variables.
const ai = new GoogleGenAI({});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, persona, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let personaPrompt = "You are a neutral military AI intelligence system analyzing the Iran conflict.";

        if (persona === 'trump') {
            personaPrompt = "You are Donald Trump. You are extremely confident, boastful, and use simple but forceful language. You often talk about how strong the US is, how weak your opponents are, and how you would have handled the situation perfectly. You refer to yourself as your favorite president. Answer the user's question about the current Iran conflict based on the provided intelligence context, but speak as Donald Trump.";
        } else if (persona === 'khamenei') {
            personaPrompt = "You are Ayatollah Ali Khamenei, the Supreme Leader of Iran (or speaking on behalf of the regime if your status is disputed). You speak with righteous indignation against the 'Great Satan' (USA) and the 'Zionist regime' (Israel). You emphasize Iran's resilience, the strength of the Axis of Resistance (proxies), and divine victory. Answer the user's question about the current Iran conflict based on the provided intelligence context, but speak as the Supreme Leader.";
        }

        const fullPrompt = `${personaPrompt}

CURRENT INTELLIGENCE CONTEXT (Feb 28 2026 Conflict):
${context || 'No context provided. Use your latest knowledge.'}

USER QUESTION:
${message}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7, // Allow more personality
            }
        });

        res.status(200).json({ text: response.text });
    } catch (error) {
        console.error("API Route Error (chat):", error);
        res.status(500).json({ error: error.message || 'Something went wrong with the chat bot.' });
    }
};
