"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Server, Globe, Shield } from "lucide-react";

const getStatusText = (progress) => {
  if (progress < 25) return "Establishing Secure DB Handshake...";
  if (progress < 50) return "Decrypting Profile Attributes...";
  if (progress < 75) return "Compiling Project & Education Matrix...";
  if (progress < 100) return "Optimizing Layout Parameters...";
  return "Systems Online. Welcome.";
};

const WelcomeScreen = ({ progress, isLoaded, onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const shouldDismiss = isLoaded && minTimeElapsed;

  useEffect(() => {
    if (shouldDismiss) {
      setIsLoading(false);
      const timer = setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shouldDismiss, onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(12px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-[99999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          {/* Futuristic CSS animations */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin-reverse {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
            .animate-spin-reverse {
              animation: spin-reverse 3s linear infinite;
            }
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(1.05); }
            }
            .ambient-glow {
              animation: pulse-glow 6s ease-in-out infinite;
            }
          ` }} />

          {/* Ambient space background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] ambient-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] ambient-glow" style={{ animationDelay: "3s" }} />
          </div>

          <div className="relative w-full max-w-lg mx-auto px-6 text-center">
            {/* Spinning futuristic ring */}
            <motion.div 
              className="relative w-28 h-28 mx-auto mb-10 flex items-center justify-center"
              variants={childVariants}
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin" style={{ animationDuration: "2s" }} />
              {/* Middle ring */}
              <div className="absolute inset-2 rounded-full border border-t-transparent border-r-pink-500 border-b-transparent border-l-cyan-500 animate-spin-reverse" />
              {/* Inner glow dot */}
              <div className="absolute w-3 h-3 bg-indigo-400 rounded-full blur-[2px] animate-pulse" />
              <Code2 className="w-8 h-8 text-white relative z-10 opacity-80" />
            </motion.div>

            {/* Title / Brand */}
            <motion.div 
              className="mb-8"
              variants={childVariants}
            >
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200">
                TWAHANUR RAHMAN
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-semibold mt-2">
                System Interface Initialization
              </p>
            </motion.div>

            {/* Loading Box */}
            <motion.div 
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)] relative overflow-hidden"
              variants={childVariants}
            >
              {/* Progress Bar Container */}
              <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status details */}
              <div className="flex justify-between items-center text-xs mt-4">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  {progress < 25 && <Globe className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                  {progress >= 25 && progress < 50 && <Shield className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                  {progress >= 50 && progress < 75 && <Server className="w-3.5 h-3.5 text-pink-400 animate-pulse" />}
                  {progress >= 75 && <Code2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="font-mono tracking-wide">{getStatusText(progress)}</span>
                </div>
                <span className="text-indigo-400 font-mono font-bold tracking-widest">[ {progress}% ]</span>
              </div>
            </motion.div>

            {/* Bottom status links */}
            <motion.div 
              className="mt-12 text-[10px] font-mono text-slate-600 flex justify-center gap-6"
              variants={childVariants}
            >
              <span>SECURE PROTOCOL // SSL</span>
              <span>HOST: VERCEL</span>
              <span>DB: ONLINE</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;