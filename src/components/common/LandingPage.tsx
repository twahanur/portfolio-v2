"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import WelcomeScreen from "../../Pages/WelcomeScreen";
import Navbar from "../Navbar";
import AnimatedBackground from "../Background";
import Home from "../../Pages/Home";
import About from "../../Pages/About";
import Portofolio from "../../Pages/Portofolio";
import Activities from "../../Pages/Activities";
import Blog from "../../Pages/Blog";
import ContactPage from "../../Pages/Contact";
import PropTypes from "prop-types";
import Education from "../../Pages/Education";
import Experience from "../../Pages/Experience";
import TechStackPage from "../../Pages/TechStack";
import GitHubContributionGraph from "../GitHubContributionGraph";
import Footer from "../../Pages/Footer";
import { usePortfolio } from "../../context/PortfolioContext";
import "aos/dist/aos.css";

const SplashCursor = dynamic(
  () => import("../AnimationComponents/SplashCursor"),
  { ssr: false }
);
const TargetCursor = dynamic(
  () => import("../AnimationComponents/TargetCursor"),
  { ssr: false }
);
const ClickSpark = dynamic(
  () => import("../AnimationComponents/ClickSpark"),
  { ssr: false }
);

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  const { portfolioData, loadingProgress, isDataLoaded } = usePortfolio();
  const [isDesktop, setIsDesktop] = useState(false);

  // Mobile check
  useEffect(() => {
    const checkIsDesktop = () => {
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      setIsDesktop(window.innerWidth >= 768 && !hasTouch);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      // DO NOT call AOS.init() — it registers a debounced scroll handler
      // that delays animations until scroll stops. The AOS CSS (aos/dist/aos.css)
      // already defines all animation states via [data-aos] selectors.
      // We just need to add 'aos-animate' class when elements enter viewport.

      // Set global defaults on body (AOS CSS uses body[data-aos-*] for defaults)
      document.body.setAttribute("data-aos-easing", "ease-out-cubic");
      document.body.setAttribute("data-aos-duration", "500");

      // IntersectionObserver fires INSTANTLY during scroll — zero debounce
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("aos-animate");
              observer.unobserve(entry.target); // once: true
            }
          });
        },
        { rootMargin: "-50px 0px 0px 0px", threshold: 0.05 }
      );

      // Observe all [data-aos] elements that aren't already animated
      const observeElements = () => {
        document.querySelectorAll("[data-aos]:not(.aos-animate)").forEach((el) => {
          observer.observe(el);
        });
      };

      observeElements();

      // MutationObserver to handle dynamically rendered sections
      // (Education, Experience, TechStack return null until data loads)
      const mutationObs = new MutationObserver(() => observeElements());
      mutationObs.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        mutationObs.disconnect();
        document.body.removeAttribute("data-aos-easing");
        document.body.removeAttribute("data-aos-duration");
      };
    }
  }, [showWelcome]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen
            progress={loadingProgress}
            isLoaded={isDataLoaded}
            onLoadingComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          {isDesktop && (
            <>
              <SplashCursor />
              <TargetCursor spinDuration={2} hideDefaultCursor={false} />
            </>
          )}
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={65}
            sparkCount={15}
            duration={400}
          >
            <Navbar />
            <AnimatedBackground />

            <Home profile={portfolioData.profile} skills={portfolioData.skills} />
            <About
              profile={portfolioData.profile}
              cv={portfolioData.cv}
              projects={portfolioData.projects}
              certificates={portfolioData.certificates}
            />
            <TechStackPage
              skills={portfolioData.skills}
              skillCategories={portfolioData.skillCategories}
            />
            <div className="md:px-[10%] px-[5%] py-12 bg-slate-950/40 relative">
              <GitHubContributionGraph />
            </div>
            <Experience experiences={portfolioData.experiences} />
            <Education educations={portfolioData.educations} />
            <Portofolio
              projects={portfolioData.projects}
              certificates={portfolioData.certificates}
            />
            <Activities activities={portfolioData.activities} />
            <Blog blogs={portfolioData.blogs} />
            <ContactPage />
            <Footer />
          </ClickSpark>
        </>
      )}
    </>
  );
};

LandingPage.propTypes = {
  showWelcome: PropTypes.bool.isRequired,
  setShowWelcome: PropTypes.func.isRequired,
};

export default LandingPage;