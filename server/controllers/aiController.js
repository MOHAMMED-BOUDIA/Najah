const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.testKey = async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say "OK" if you can read this.');
    const reply = result.response.text();
    res.json({ 
      success: true, 
      keyExists: !!key,
      keyPrefix: key?.substring(0, 8),
      keyLength: key?.length,
      modelResponse: reply 
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

    console.log('🔑 GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
    console.log('🔑 GEMINI_API_KEY prefix:', process.env.GEMINI_API_KEY?.substring(0, 8));

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are NAJAH Assistant, a helpful AI for an online learning platform.
NAJAH connects students with expert instructors for professional training (formations).
Guidelines:
- Be friendly, concise, and helpful
- Answer questions about the platform, courses, learning tips
- If asked about technical issues, suggest contacting support
- Respond in the same language as the user (English/French/Arabic)
- Keep responses under 150 words
- Use emojis occasionally to be friendly 😊`
    });

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

    const chatSession = model.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    console.log('🚀 Sending to Gemini — message:', message.substring(0, 50));
    console.log('🚀 History items:', geminiHistory.length);

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini AI error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      message: 'AI service error', 
      error: error.message,
      stack: error.stack,
      code: error.code || error.status || null
    });
  }
};
