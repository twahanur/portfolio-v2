import { memo } from "react";
import GradientText from "./AnimationComponents/GradientText";

const MainTitle = memo(() => {
  return (
    <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold tracking-tight">
        <span className="relative inline-block ">
          <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
              className="bg-transparent"
            >
              Junior
            </GradientText>
          </span>
        </span>
        <br />
        <span className="relative inline-block mt-2">
          <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
          <span className="relative bg-clip-text text-transparent outline-text">
            Developer
          </span>
        </span>
      </h1>
    </div>
  );
});

MainTitle.displayName = "MainTitle";

export default MainTitle;
