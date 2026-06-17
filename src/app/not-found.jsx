"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg space-y-8 flex flex-col items-center">
        {/* Warning Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          {/* Pulsing ring */}
          <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center relative">
            <ShieldAlert className="h-10 w-10 text-red-400" />
            <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
        </motion.div>

        {/* 404 Header */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-500">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-200">
            Page Not Found / warning
          </h2>
        </div>

        {/* Warning Message */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Warning: You have accessed an invalid path or a resource that has been moved. 
          Please return to the main dashboard or home workspace.
        </p>

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
