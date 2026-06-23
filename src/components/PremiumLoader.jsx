'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Database, Activity } from 'lucide-react';

const PREMIUM_STEPS = {
  project: [
    { text: "ESTABLISHING SECURE CONNECTION...", icon: Shield, color: "text-blue-400" },
    { text: "FETCHING ARTIFACT DATA FROM CORE...", icon: Database, color: "text-indigo-400" },
    { text: "COMPILING SYSTEM DESIGN SCHEMATICS...", icon: Cpu, color: "text-purple-400" },
    { text: "RENDERING PROJECT VISUAL LAYOUT...", icon: Activity, color: "text-pink-400" },
  ],
  blog: [
    { text: "RESOLVING JOURNAL ENDPOINT...", icon: Shield, color: "text-emerald-400" },
    { text: "PULLING MARKDOWN STREAM...", icon: Database, color: "text-teal-400" },
    { text: "PARSING MATHEMATICAL & CODE NODES...", icon: Cpu, color: "text-cyan-400" },
    { text: "INJECTING HYPERTEXT RENDERS...", icon: Activity, color: "text-indigo-400" },
  ]
};

export default function PremiumLoader({ mode = "project" }) {
  const steps = PREMIUM_STEPS[mode] || PREMIUM_STEPS.project;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden font-mono px-4">
      {/* Background glow elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        {/* Animated Cybernetic Core */}
        <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
          {/* External rotating gear ring */}
          <div className="absolute inset-0 border-2 border-dashed border-blue-500/25 rounded-full animate-[spin_20s_linear_infinite]" />
          
          {/* Middle reverse-rotating ring */}
          <div className="absolute inset-4 border border-double border-purple-500/30 border-t-purple-500/80 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
          
          {/* Inner pulse circle */}
          <div className="absolute inset-10 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 border border-blue-500/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-0 rounded-full animate-[spin_6s_linear_infinite]">
            <span className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full blur-[2px] shadow-[0_0_10px_#3b82f6]" />
          </div>
          <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite_reverse]">
            <span className="absolute -bottom-1 left-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full blur-[1px] shadow-[0_0_8px_#c084fc]" />
          </div>
        </div>

        {/* Console Box */}
        <div className="w-full bg-[#050512]/90 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Scanner Line */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent top-0 animate-[scan_2.5s_ease-in-out_infinite]" />

          {/* Terminal Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold tracking-wider text-[10px]">SYSTEM CORE LOADER</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[10px] text-blue-400">ONLINE</span>
            </div>
          </div>

          {/* Log steps */}
          <div className="space-y-3 min-h-[120px] flex flex-col justify-center">
            <AnimatePresence mode="popLayout">
              {steps.slice(0, currentStep + 1).map((step, idx) => {
                const Icon = step.icon;
                const isCurrent = idx === currentStep;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-3 text-xs md:text-sm font-semibold ${isCurrent ? step.color : 'text-slate-500'}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'animate-pulse' : ''}`} />
                    <span className="tracking-wide">{step.text}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress Percent */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="w-2/3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.3; }
          50% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
