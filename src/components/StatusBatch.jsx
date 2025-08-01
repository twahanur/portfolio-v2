import { memo } from "react";
import { Sparkles } from "lucide-react";

const StatusBadge = memo(() => {
  return (
    <div
      className="inline-block animate-float lg:mx-0 animate-tubelightFlicker"
      data-aos="zoom-in"
      data-aos-delay="400"
    >
      <div className="relative mt-10 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
            <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
            Driven by Logic, Inspired by Innovation
          </span>
        </div>
      </div>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
