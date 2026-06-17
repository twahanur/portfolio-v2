"use client";

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, memo } from "react";
import { Mail, ExternalLink, Github, Linkedin, Instagram, Facebook, Twitter, Youtube, Globe } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import StatusBadge from "../components/StatusBatch";
import MainTitle from "../components/MainTitle";
import TechStack from "../components/TechStack";
import CTAButton from "../components/CTAButton";
import SocialLinkBtn from "../components/SocialLink";
import { DataStore } from "../assets/DataStore";

import Magnet from "../components/AnimationComponents/Magnet";
import RotatingText from "../components/AnimationComponents/RotetingText";
const { TECH_STACK } = DataStore;

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [words, setWords] = useState([]);
  const [title, setTitle] = useState("Fullstack Developer");
  const [bio, setBio] = useState("✨ A curious mind crafting scalable systems — I specialize in building backend services that power modern applications.");
  const [techStack, setTechStack] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/ai-context`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data) {
            if (payload.data.profile) {
              const p = payload.data.profile;
              if (p.words) {
                const parsedWords = p.words.split(",").map(w => w.trim()).filter(Boolean);
                if (parsedWords.length > 0) {
                  setWords(parsedWords);
                }
              }
              if (p.title) {
                setTitle(p.title);
              }
              if (p.bio) {
                setBio(p.bio);
              }

              // Build dynamic socials list
              const socials = [];
              if (p.github) socials.push({ icon: Github, link: p.github });
              if (p.linkedin) socials.push({ icon: Linkedin, link: p.linkedin });
              if (p.instagram) socials.push({ icon: Instagram, link: p.instagram });
              if (p.facebook) socials.push({ icon: Facebook, link: p.facebook });
              if (p.twitter) socials.push({ icon: Twitter, link: p.twitter });
              if (p.youtube) socials.push({ icon: Youtube, link: p.youtube });
              if (p.stackoverflow) socials.push({ icon: Globe, link: p.stackoverflow });
              if (p.medium) socials.push({ icon: Globe, link: p.medium });
              if (p.devto) socials.push({ icon: Globe, link: p.devto });
              
              setSocialLinks(socials);
            }
            if (payload.data.skills) {
              const sortedSkills = [...payload.data.skills]
                .sort((a, b) => a.order - b.order)
                .map(s => s.name);
              // Slice to top 8 skills to keep the hero section visually clean and prevent overlap
              setTechStack(sortedSkills.slice(0, 8));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
      }
    };

    fetchProfile();
  }, []);

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
  // Lottie configuration
  const lottieOptions = {
    src: "https://lottie.host/58753882-bb6a-49f5-a2c0-950eda1e135a/NLbpVqGegK.lottie",
    loop: true,
    autoplay: true,
    settings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: true,
    },
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 ${
      isHovering
        ? "scale-[180%] sm:scale-[160%] md:scale-[150%] lg:scale-[145%] rotate-2"
        : "scale-[175%] sm:scale-[155%] md:scale-[145%] lg:scale-[140%]"
    }`,
  };

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <div
        className={`relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[5%] min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen md:justify-between gap-12 sm:gap-16 lg:gap-20 py-24 md:py-32 lg:py-0">
            {/* Left Column */}
            <div
              className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle title={title} />

                {/* Typing Effect */}
                {/* <TypingEffect /> */}
                {words.length > 0 && (
                  <RotatingText
                    texts={words}
                    staticText=""
                    staticTextClassName="text-gray-400"
                    mainClassName="overflow-hidden py-0.5 sm:py-1 md:py-2 text-3xl rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                )}

                {/* Description */}
                <p
                  className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  {bio}
                </p>

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <div
                    className="flex flex-wrap gap-3 justify-start"
                    data-aos="fade-up"
                    data-aos-delay="1200"
                  >
                    {techStack.map((tech, index) => (
                      <Magnet
                        key={index}
                        padding={20}
                        disabled={false}
                        magnetStrength={10}
                      >
                        <TechStack key={index} tech={tech} />
                      </Magnet>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div
                  className="flex flex-row gap-3 w-full justify-start"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                >
                  <CTAButton
                  
                    href="#Portofolio"
                    text="Projects"
                    icon={ExternalLink}
                  />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div
                    className="hidden sm:flex gap-4 justify-start"
                    data-aos="fade-up"
                    data-aos-delay="1600"
                  >
                    {socialLinks.map((social, index) => (
                      <Magnet
                        key={index}
                        padding={10}
                        disabled={false}
                        magnetStrength={5}
                      >
                        <SocialLinkBtn key={index} {...social} />
                      </Magnet>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Optimized Lottie Animation */}
            <div
              className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600"
            >
              <div className="relative w-full opacity-90">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}
                ></div>

                <div
                  className={`relative z-10 w-full opacity-90 transform transition-transform duration-500 ${
                    isHovering ? "scale-105" : "scale-100"
                  }`}
                >
                  <DotLottieReact {...lottieOptions} />
                </div>

                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}
                >
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`}
                  ></div>
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
