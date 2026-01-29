
import React, { useState, useRef, useEffect } from 'react';
import { analyzeText } from '../geminiService';
import { Message } from '../types';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '您好，我是您的武俠文學導讀助手。您可以問我關於郭襄的心境、小龍女的描寫，或這段情節在《倚天屠龍記》中的意義。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await analyzeText(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', content: response || "無法獲取回應。" }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 w-14 h-14 bg-amber-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-amber-700 transition-all z-40 border-2 border-amber-950"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-screen bg-stone-50 shadow-2xl z-50 flex flex-col border-l border-amber-900/20">
          <div className="p-4 bg-amber-900 text-stone-100 flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold">武俠導讀助手</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-amber-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-amber-700 text-white rounded-tr-none' 
                  : 'bg-stone-200 text-stone-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-200 p-3 rounded-xl text-stone-500 text-xs animate-pulse">AI 正在思考中...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t bg-stone-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="輸入問題..."
              className="flex-1 px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800/50 bg-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              發送
            </button>
          </div>
        </div>
      )}
    </>
  );
};
