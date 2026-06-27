import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: '👋 Hi! I\'m NAJAH Assistant. How can I help you today?'
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6);
      const res = await API.post('/ai/chat', {
        message: input,
        history
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply
      }]);
    } catch (error) {
      console.error('❌ AI Chat error:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      const serverMsg = error.response?.data?.error || error.message;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${serverMsg}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB900] to-[#0084D1] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          aria-label="Open AI Assistant"
        >
          <FiMessageCircle className="text-2xl" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Ask AI ✨
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideUp">
          <div className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <FiZap className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold">NAJAH AI</h3>
                <p className="text-white/90 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Powered by Gemini
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#0084D1] to-[#0066a8] text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-700 dark:text-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#0084D1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#FFB900] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#0084D1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0084D1] text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-[#FFB900] to-[#0084D1] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <FiSend />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              ✨ Powered by Google Gemini
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
