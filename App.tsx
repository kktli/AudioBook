
import React, { useState, useEffect, useRef } from 'react';
import { CHAPTER_ONE } from './constants';
import { AudioPlayer } from './components/AudioPlayer';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  
  // 嘗試加載 audio.mp3
  // 如果檔案不在根目錄，AudioPlayer 會顯示手動選取提示
  const audioUrl = "audio.mp3"; 

  useEffect(() => {
    // 找出目前時間對應的文本段落
    // 使用 0.2s 的微小偏移以獲得更平滑的切換感
    const active = [...CHAPTER_ONE.content]
      .reverse()
      .find(segment => currentTime >= segment.startTime - 0.2);
    
    if (active && active.id !== activeId) {
      setActiveId(active.id);
      
      const element = document.getElementById(`segment-${active.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, activeId]);

  return (
    <div className="min-h-screen bg-[#fcf9f2] selection:bg-amber-200">
      {/* 背景宣紙紋理 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] z-10"></div>

      <header className="relative pt-24 pb-16 px-6 flex flex-col items-center z-20">
        <div className="mb-6 flex items-center justify-center space-x-6">
          <div className="h-px w-16 bg-amber-900/30"></div>
          <span className="text-amber-900/60 font-serif tracking-[0.4em] text-sm uppercase font-bold">金庸有聲書 倚天屠龍記</span>
          <div className="h-px w-16 bg-amber-900/30"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 tracking-[0.2em] text-center drop-shadow-sm">
          {CHAPTER_ONE.title}
        </h1>
        <h2 className="text-2xl md:text-4xl font-serif text-amber-900 italic text-center opacity-80">
          {CHAPTER_ONE.subtitle}
        </h2>
        
        <div className="mt-12 w-32 h-1 bg-amber-900/10 rounded-full shadow-inner"></div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-72 relative z-20">
        <div className="space-y-16">
          {CHAPTER_ONE.content.map((segment) => (
            <div 
              key={segment.id}
              id={`segment-${segment.id}`}
              className={`transition-all duration-1000 p-10 rounded-[2.5rem] border-2 group relative ${
                activeId === segment.id 
                ? 'bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] scale-[1.02] border-amber-800/10 text-stone-950 ring-1 ring-amber-900/5' 
                : 'opacity-15 text-stone-600 border-transparent blur-[0.5px] hover:opacity-30'
              }`}
            >
              {/* 左側動態指示器 */}
              {activeId === segment.id && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-amber-700 rounded-full animate-pulse shadow-[0_0_10px_rgba(185,28,28,0.2)]"></div>
              )}
              
              <p className="text-2xl md:text-3xl leading-[3rem] md:leading-[3.5rem] tracking-wider font-serif font-medium">
                {segment.text}
              </p>
            </div>
          ))}
        </div>
      </main>

      <AudioPlayer 
        onTimeUpdate={setCurrentTime} 
        audioUrl={audioUrl} 
      />

      <footer className="py-24 px-6 text-center text-stone-400 font-serif italic text-xs space-y-3 opacity-40">
        <p className="tracking-[0.5em] uppercase">．</p>
        <p>© 倚天屠龍記 ． 第一回 ． 天涯思君不可忘</p>
      </footer>
    </div>
  );
};

export default App;
