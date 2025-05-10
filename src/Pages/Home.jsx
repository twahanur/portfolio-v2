/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, memo } from "react";
import { Mail, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import SplineViewer from "../components/SplineViewer";
import StatusBadge from "../components/StatusBatch";
import MainTitle from "../components/MainTitle";
import TechStack from "../components/TechStack";
import CTAButton from "../components/CTAButton";
import SocialLinkBtn from "../components/SocialLink";
import { DataStore } from "../assets/DataStore";
import TypingEffect from "../components/TypingEffect";
const { SOCIAL_LINKS, TECH_STACK } = DataStore;

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener("resize", initAOS);
    return () => window.removeEventListener("resize", initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#030014] overflow-hidden relative"
      id="Home"
    >

      {/* Background SplineViewer */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-8xl h-[400px] sm:h-[500px] md:h-[600px] ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      >
        <SplineViewer />
        
      </div>

      {/* Foreground Content */}
      <div
        className={`relative z-20 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-[5%] py-16 lg:py-20">
          <div className="flex flex-col items-center text-left space-y-8 lg:items-start">
            <StatusBadge />
            <MainTitle />
            <TypingEffect />

            <p
              className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
              data-aos="fade-up"
              data-aos-delay="1000"
            >
              Self-dependent, enthusiastic, and responsible developer skilled in
              mobile and web apps, seeking opportunities to apply creativity,
              knowledge, and skills.
            </p>

            <div
              className="flex flex-wrap gap-3"
              data-aos="fade-up"
              data-aos-delay="1200"
            >
              {TECH_STACK.map((tech, index) => (
                <TechStack key={index} tech={tech} />
              ))}
            </div>

            <div
              className="flex w-full flex-row flex-wrap gap-3 justify-between"
              data-aos="fade-up"
              data-aos-delay="1400"
            >
              <div className="flex flex-row flex-wrap lg:gap-3">
                <CTAButton
                  href="#Portofolio"
                  text="Projects"
                  icon={ExternalLink}
                />
                <CTAButton
                  href="#Contact"
                  text="Contact"
                  icon={Mail}
                  data-automotion-id="atc"
                />
              </div>
              <div className="flex flex-row  flex-wrap">
              
                <div
                  className="flex gap-4 justify-between items-center"
                  data-aos="fade-up"
                  data-aos-delay="1600"
                >
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLinkBtn key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
