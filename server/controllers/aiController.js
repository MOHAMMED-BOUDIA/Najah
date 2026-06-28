const API_KEY = () => process.env.GEMINI_API_KEY;
const BASE = 'https://generativelanguage.googleapis.com/v1/models';
const MODEL = 'gemini-2.0-flash';

exports.testKey = async (req, res) => {
  try {
    const key = API_KEY();
    const url = `${BASE}/${MODEL}:generateContent?key=${key}`;
    const body = { contents: [{ parts: [{ text: 'Say "OK" if you can read this.' }] }] };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data));
    res.json({
      success: true,
      keyExists: !!key,
      keyPrefix: key?.substring(0, 8),
      keyLength: key?.length,
      modelResponse: data.candidates?.[0]?.content?.parts?.[0]?.text || '(no text)'
    });
  } catch (error) {
    res.json({
      success: false,
      keyExists: !!API_KEY(),
      keyPrefix: API_KEY()?.substring(0, 8),
      keyLength: API_KEY()?.length,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    console.log('🔑 KEY exists:', !!API_KEY());
    console.log('🔑 KEY prefix:', API_KEY()?.substring(0, 8));

    const contents = [];

    let cleanHistory = history.filter(m => m.content && m.content.trim());
    const firstUserIndex = cleanHistory.findIndex(m => m.role === 'user');
    if (firstUserIndex > 0) {
      cleanHistory = cleanHistory.slice(firstUserIndex);
    } else if (firstUserIndex === -1) {
      cleanHistory = [];
    }

    for (const msg of cleanHistory) {
      contents.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const url = `${BASE}/${MODEL}:generateContent?key=${API_KEY()}`;
    const body = {
      contents,
      system_instruction: { parts: [{ text: 'You are NAJAH Assistant, a helpful AI for an online learning platform. Be friendly, concise, and helpful. Respond in the same language as the user (English/French/Arabic). Keep responses under 150 words. Use emojis occasionally.' }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    };

    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();

    if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    res.status(500).json({ message: 'AI service error', error: error.message, stack: error.stack, code: error.code || error.status || null });
  }
};
