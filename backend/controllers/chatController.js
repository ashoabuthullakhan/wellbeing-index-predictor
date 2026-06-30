const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');

const SYSTEM_INSTRUCTION = `You are HDI Assistant, an expert AI advisor on the Human Development Index (HDI).

DOMAIN KNOWLEDGE:
- The HDI is published by the United Nations Development Programme (UNDP).
- It measures three dimensions: Health (Life Expectancy at Birth), Education (Mean Years of Schooling + Expected Years of Schooling), and Standard of Living (GNI per Capita in PPP $).
- HDI scores range from 0.0 to 1.0.
- Categories: Very High (≥0.800), High (0.700–0.799), Medium (0.550–0.699), Low (<0.550).

CAPABILITIES:
1. Answer questions about HDI methodology, specific countries, development trends, and what affects HDI scores.
2. Help users fill in the prediction form by extracting the 4 required features from natural language.

FORM-FILL EXTRACTION:
When a user says something like "predict for a country with life expectancy 75, mean schooling 10, expected schooling 14, and GNI 15000" or "predict for Sweden", extract the values and respond with a JSON block:
\`\`\`json
{"intent": "predict", "countryName": "...", "lifeExpectancy": ..., "meanYearsSchooling": ..., "expectedYearsSchooling": ..., "gniPerCapita": ...}
\`\`\`

If the user mentions a country name but no specific values, use your knowledge of approximate real-world indicators for that country.

If you cannot determine all 4 features, ask the user for the missing ones. Do NOT guess randomly.

For all other questions, respond conversationally with clear, concise, educational answers. Keep responses under 200 words unless the user asks for detail.`;

// @desc    Chat with Gemini AI assistant
// @route   POST /api/chat
// @access  Protected
exports.sendMessage = async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Check user credits
    const user = await User.findById(req.user._id);
    const CHAT_COST = 2;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.credits < CHAT_COST) {
      return res.status(402).json({
        error: `Not enough credits. ${CHAT_COST} credits required.`,
        creditsRemaining: user.credits,
      });
    }

    // Build conversation contents for Gemini
    const contents = [];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) { // Last 10 messages for context
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Call Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const aiReply = response.text || 'I could not generate a response. Please try again.';

    // Deduct credits
    user.credits = Math.max(0, user.credits - CHAT_COST);
    await user.save();

    // Check if response contains a predict intent JSON block
    let predictData = null;
    const jsonMatch = aiReply.match(/```json\s*\n?([\s\S]*?)\n?\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.intent === 'predict') {
          predictData = {
            countryName: parsed.countryName || '',
            lifeExpectancy: parsed.lifeExpectancy,
            meanYearsSchooling: parsed.meanYearsSchooling,
            expectedYearsSchooling: parsed.expectedYearsSchooling,
            gniPerCapita: parsed.gniPerCapita,
          };
        }
      } catch { /* JSON parse failed, not a predict intent */ }
    }

    return res.status(200).json({
      reply: aiReply,
      predictData,
      creditsRemaining: user.credits,
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
};
