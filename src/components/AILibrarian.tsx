import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { GlassCard } from './GlassCard';

export const AILibrarian: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am Libra, your AI librarian. I can recommend books, help with library operations, or share tips to boost your reading streak. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          chatHistory: messages.slice(-5), // Send recent context
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I am having connection trouble at the moment. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-librarian-container" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="ai-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">Ask Libra (AI)</span>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <GlassCard
          id="ai-chat-window"
          className="w-96 h-[500px] flex flex-col overflow-hidden shadow-2xl border-white/30 bg-white/90 dark:bg-slate-900/90"
        >
          {/* Header */}
          <div id="ai-chat-header" className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Libra AI Librarian</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-200" />
                  Powered by Gemini 3.5 Flash
                </p>
              </div>
            </div>
            <button
              id="ai-chat-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div id="ai-chat-body" ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] flex gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-2xl text-sm ${
                          isBot
                            ? 'bg-gray-100 dark:bg-slate-800 text-gray-950 dark:text-white rounded-tl-none font-semibold'
                            : 'bg-blue-600 text-white rounded-tr-none font-semibold'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-800 dark:text-slate-300 mt-1 block px-1 font-bold">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div id="ai-chat-loading" className="flex justify-start">
                <div className="flex gap-2 items-center max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 text-sm rounded-2xl rounded-tl-none flex items-center gap-1 font-semibold">
                    Libra is typing...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input Area */}
          <form id="ai-chat-input-form" onSubmit={handleSend} className="p-3 border-t border-gray-200/50 dark:border-white/10 flex gap-2">
            <input
              id="ai-chat-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
};
