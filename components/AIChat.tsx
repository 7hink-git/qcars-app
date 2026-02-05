import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2 } from 'lucide-react';
import { getCarRecommendations } from '../services/geminiService';

interface AIChatProps {
  onRecommend: (ids: string[]) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onRecommend }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm Q-Bot. Tell me about your trip (e.g., 'weekend in the mountains' or 'business trip alone') and I'll suggest the perfect car." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const result = await getCarRecommendations(userText);

    setMessages(prev => [...prev, { role: 'ai', text: result.message }]);
    setLoading(false);
    
    if (result.recommendedCarIds.length > 0) {
      onRecommend(result.recommendedCarIds);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 max-h-[600px] h-[70vh]">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Q-Bot Assistant</h3>
              <p className="text-indigo-200 text-xs">Powered by Gemini AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Suggest a car for..."
              className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;