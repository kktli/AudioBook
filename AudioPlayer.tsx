
import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  onTimeUpdate: (time: number) => void;
  audioUrl: string | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onTimeUpdate, audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(audioUrl);

  useEffect(() => {
    setLocalUrl(audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate(audio.currentTime);
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setLoadError(null);
    };

    const handleEnded = () => setIsPlaying(false);
    
    const handleError = () => {
      const error = audio.error;
      let msg = "音檔加載失敗。";
      if (error?.code === 4) msg = "請點擊右側按鈕手動選取 mp3。";
      setLoadError(msg);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!localUrl) {
      fileInputRef.current?.click();
      return;
    }
    
    if (audioRef.current?.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setLoadError(null);
      }).catch(e => {
        console.error("Playback failed:", e);
        setLoadError("播放失敗，請確認檔案格式或嘗試重新選取。");
      });
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalUrl(url);
      setLoadError(null);
      if (audioRef.current) {
        audioRef.current.load();
        setTimeout(() => {
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
        }, 200);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#fcf9f2]/95 backdrop-blur-2xl text-stone-900 p-5 border-t border-amber-900/20 flex flex-col md:flex-row items-center gap-6 z-50 shadow-[0_-15px_50px_rgba(0,0,0,0.1)]">
      <audio ref={audioRef} src={localUrl || ""} preload="auto" style={{ display: 'none' }} />
      <input type="file" ref={fileInputRef} accept="audio/mp3,audio/*" className="hidden" onChange={handleFileSelect} />
      
      <div className="flex items-center gap-5 min-w-[200px]">
        <button 
          onClick={togglePlay}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-90 ${
            !localUrl ? 'bg-amber-800 animate-pulse' : 'bg-amber-700 hover:bg-amber-600 shadow-amber-900/20 text-white'
          }`}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        {/* 音檔時間 為黑色 */}
        <div className="text-sm font-mono tracking-tighter tabular-nums text-black font-bold">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-2 opacity-30 text-stone-400">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full">
        <input 
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-700 hover:accent-amber-600 transition-all"
        />
        <div className="flex justify-between items-center px-1">
          <span className={`text-[11px] font-serif italic ${loadError ? 'text-red-500 animate-pulse' : 'text-stone-500'}`}>
            {loadError || (localUrl ? "正在播放：倚天屠龍記 第一回" : "等待載入音訊檔案...")}
          </span>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-[11px] text-amber-800 hover:text-amber-700 font-serif border border-amber-900/20 px-3 py-1 rounded-full bg-white shadow-sm transition-all hover:shadow-md"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            選擇 MP3 檔案
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 min-w-[160px] justify-end">
        <svg className="w-5 h-5 text-stone-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-500"
        />
      </div>
    </div>
  );
};
