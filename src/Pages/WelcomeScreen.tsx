"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getStatusText = (progress) => {
  if (progress < 20) return "Connecting to server...";
  if (progress < 40) return "Loading profile data...";
  if (progress < 60) return "Fetching projects...";
  if (progress < 80) return "Loading assets...";
  if (progress < 100) return "Almost ready...";
  return "Welcome";
};

const WelcomeScreen = ({ progress, isLoaded, onLoadingComplete }) => {
  const ownerName = process.env.NEXT_PUBLIC_OWNER || "TWAHANUR RAHMAN";
  const [isLoading, setIsLoading] = useState(true);

  // No artificial minimum time — dismiss as soon as data is loaded
  useEffect(() => {
    if (isLoaded && progress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 400);
      }, 300); // tiny grace period for visual completion
      return () => clearTimeout(timer);
    }
  }, [isLoaded, progress, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-[99999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)",
            transition: { duration: 0.4, ease: "easeOut" },
          }}
        >
          {/* Inline styles for animations */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes scanGlow {
              0% { left: -20%; }
              100% { left: 120%; }
            }
            @keyframes pulseRing {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.15); opacity: 0.6; }
            }
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .scan-glow {
              animation: scanGlow 1.2s ease-in-out infinite;
            }
            .pulse-ring {
              animation: pulseRing 2s ease-in-out infinite;
            }
            .fade-slide-up {
              animation: fadeSlideUp 0.5s ease-out forwards;
            }
          `,
            }}
          />

          {/* Subtle ambient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pulse-ring" />
            <div
              className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pulse-ring"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative w-full max-w-md mx-auto px-6 text-center fade-slide-up">
            {/* Minimal spinner */}
            <div className="relative w-16 h-16 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"
                style={{ animationDuration: "1s" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono text-white/70 font-bold">
                  {progress}
                </span>
              </div>
            </div>

            {/* Brand */}
            <div className="text-lg md:text-xl font-bold tracking-[0.3em] text-white/90 uppercase mb-1">
              {ownerName}
            </div>

            {/* Progress bar with scanning glow */}
            <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative mb-3">
              {/* Filled portion */}
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
                }}
              />
              {/* Scanning glow line on top of filled area */}
              {progress < 100 && (
                <div
                  className="absolute top-0 h-full w-[30%] scan-glow pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    clipPath: `inset(0 ${100 - progress}% 0 0)`,
                  }}
                />
              )}
            </div>

            {/* Status text */}
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-mono">
                {getStatusText(progress)}
              </span>
              <span className="text-indigo-400/80 font-mono font-semibold">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
