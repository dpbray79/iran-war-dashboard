const { GoogleGenAI } = require("@google/genai");

// Note: Ensure GEMINI_API_KEY is set in Vercel environment variables.
const ai = new GoogleGenAI({}); 

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const prompt = `You are an intelligence briefing system monitoring the Iran-Israel-US conflict that began on February 28, 2026. Search the web for the very latest news right now and provide:

1. A concise intelligence briefing (3-4 paragraphs) covering:
   - Current military situation: what's happening right now
   - Latest casualty figures confirmed for Iran, Israel, and US forces
   - Status of Ayatollah Khamenei (confirmed dead or alive?)
   - Status of Strait of Hormuz
   - Iran proxy group activity (Hezbollah, Houthis, Kataib Hezbollah)
   - Diplomatic responses and international reactions

2. After the briefing, output a JSON block wrapped in <STATS> tags with this exact structure:
<STATS>
{
  "iran": { "dead": "number or range or unknown", "injured": "number", "militaryDead": "number", "civilianDead": "number", "leadersKilled": "name or disputed", "sitesHit": "number" },
  "israel": { "dead": "number", "injured": "number", "militaryDead": "number", "civilianDead": "number", "missilesIntercepted": "number", "missilesFired": "number" },
  "us": { "dead": "number", "injured": "number", "militaryDead": "number", "basesHit": "number", "assetsLost": "number or unknown", "sorties": "number or unknown" },
  "proxies": { "activeFronts": "number", "attacksLaunched": "number", "hezbollah": "status", "houthis": "status", "kataibHB": "status", "hamas": "status" },
  "global": { "oilPrice": "number or status", "straitOfHormuz": "status", "airspaceClosed": "list or status", "unResponse": "status" },
  "events": [
    { "time": "HH:MM UTC", "severity": "critical|major|info", "headline": "...", "detail": "...", "source": "outlet name" }
  ]
}
</STATS>

Use "—" for unknown values. Base all figures on confirmed reports only — do not speculate. Note if figures are disputed.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Keep factual
      }
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("API Route Error (briefing):", error);
    res.status(500).json({ error: error.message || 'Something went wrong fetching the briefing.' });
  }
};
