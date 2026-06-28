const { GoogleGenAI } = require('@google/genai');

let ai;
function getClient() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

exports.testKey = async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    const client = getClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Say "OK" if you can read this.',
    });
    res.json({ 
      success: true, 
      keyExists: !!key,
      keyPrefix: key?.substring(0, 8),
      keyLength: key?.length,
      modelResponse: response.text 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      keyExists: !!process.env.GEMINI_API_KEY,
      keyPrefix: process.env.GEMINI_API_KEY?.substring(0, 8),
      keyLength: process.env.GEMINI_API_KEY?.length,
      error: error.message,
      code: error.code || error.status || null,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    console.log('🔑 KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 KEY prefix:', process.env.GEMINI_API_KEY?.substring(0, 8));

    let cleanHistory = history.filter(m => m.content && m.content.trim());
    const firstUserIndex = cleanHistory.findIndex(m => m.role === 'user');
    if (firstUserIndex > 0) {
      cleanHistory = cleanHistory.slice(firstUserIndex);
    } else if (firstUserIndex === -1) {
      cleanHistory = [];
    }

    const geminiHistory = cleanHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const client = getClient();
    const chat = await client.chats.create({
      model: 'gemini-2.0-flash',
      history: geminiHistory,
      config: {
        systemInstruction: 'You are NAJAH Assistant, a helpful AI for an online learning platform. Be friendly, concise, and helpful. Respond in the same language as the user (English/French/Arabic). Keep responses under 150 words. Use emojis occasionally.',
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    res.status(500).json({ 
      message: 'AI service error', 
      error: error.message,
      stack: error.stack,
      code: error.code || error.status || null
    });
  }
};
