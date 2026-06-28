const BASE = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

exports.testKey = async (req, res) => {
  try {
    const key = process.env.GROQ_API_KEY;
    const r = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }], max_tokens: 10 }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data));
    res.json({
      success: true,
      keyExists: !!key,
      keyPrefix: key?.substring(0, 8),
      keyLength: key?.length,
      modelResponse: data.choices?.[0]?.message?.content || '(no text)',
    });
  } catch (error) {
    res.json({
      success: false,
      keyExists: !!process.env.GROQ_API_KEY,
      keyPrefix: process.env.GROQ_API_KEY?.substring(0, 8),
      keyLength: process.env.GROQ_API_KEY?.length,
      error: error.message,
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [];
    let cleanHistory = history.filter(m => m.content && m.content.trim());
    const firstUserIndex = cleanHistory.findIndex(m => m.role === 'user');
    if (firstUserIndex > 0) cleanHistory = cleanHistory.slice(firstUserIndex);
    else if (firstUserIndex === -1) cleanHistory = [];
    messages.push({ role: 'system', content: 'You are NAJAH Assistant, a helpful AI for an online learning platform. Be friendly, concise, and helpful. Respond in the same language as the user (English/French/Arabic). Keep responses under 150 words. Use emojis occasionally.' });
    for (const msg of cleanHistory) {
      messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
    }
    messages.push({ role: 'user', content: message });

    const r = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data));

    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ reply });
  } catch (error) {
    console.error('Groq error:', error.message);
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};
