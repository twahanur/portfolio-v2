import { memo } from "react";

const MainTitle = memo(() => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full mx-auto space-y-6 lg:space-y-0 text-center lg:text-left z-0 relative">
      {/* "Junior" - aligned right */}
      <div className="w-full lg:w-1/2 text-left md:text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight animate-tubelightFlicker">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-xl opacity-30 rounded-lg"></span>
            <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Junior
            </span>
          </span>
        </h1>
      </div>

      {/* "Developer" */}
      <div className="w-full lg:w-1/2 text-left md:text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-tight animate-tubelightFlicker">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-xl opacity-30 rounded-lg"></span>
            <span className="relative bg-clip-text text-transparent outline-text">
              Developer
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
});

MainTitle.displayName = "MainTitle";

export default MainTitle;
