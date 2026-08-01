"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Mic, Sparkles } from "lucide-react";

interface AudioBioWidgetProps {
  audioUrl?: string;
}

export default function AudioBioWidget({ audioUrl }: AudioBioWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback demo audio if audioUrl is not provided
  const fallbackAudio = audioUrl || "https://actions.google.com/sounds/v1/ambiences/office_voices.ogg";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Fallback speech synthesis if audio file cannot be loaded
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const text = "Hello! Welcome to my portfolio. I am Twahanur Rahman, a full-stack web developer passionate about building scalable, responsive web applications.";
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="inline-flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-[#6366f1]/40 transition-all duration-300 shadow-xl group">
      <audio ref={audioRef} src={fallbackAudio} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
          isPlaying
            ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-[#6366f1]/30 scale-105"
            : "bg-white/10 text-white hover:bg-[#6366f1]/20 hover:text-[#6366f1]"
        }`}
        title={isPlaying ? "Pause Voice Bio" : "Listen 30s Voice Bio"}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Details & Soundwave */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-[#6366f1]" /> 30-Sec Audio Bio
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-semibold border border-[#6366f1]/20 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> Voice
          </span>
        </div>

        {/* Sound Equalizer Animated Bars or Time Counter */}
        <div className="flex items-center gap-2 mt-1">
          {isPlaying ? (
            <div className="flex items-center gap-1 h-3.5">
              <span className="w-1 h-full bg-[#6366f1] rounded-full animate-[bounce_0.6s_infinite]" />
              <span className="w-1 h-3/4 bg-[#a855f7] rounded-full animate-[bounce_0.8s_infinite]" />
              <span className="w-1 h-full bg-emerald-400 rounded-full animate-[bounce_0.5s_infinite]" />
              <span className="w-1 h-2/3 bg-[#6366f1] rounded-full animate-[bounce_0.7s_infinite]" />
              <span className="w-1 h-full bg-[#a855f7] rounded-full animate-[bounce_0.9s_infinite]" />
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>
      </div>

      {/* Mute Button */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
