"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import WelcomeScreen from "../../Pages/WelcomeScreen";
import Navbar from "../Navbar";
import AnimatedBackground from "../Background";
import Home from "../../Pages/Home";
import PropTypes from "prop-types";
import { usePortfolio } from "../../context/PortfolioContext";
import "aos/dist/aos.css";

// Dynamically import below-the-fold components to reduce initial JS payload & boost Performance score
const About = dynamic(() => import("../../Pages/About"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});
const TechStackPage = dynamic(() => import("../../Pages/TechStack"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const GitHubContributionGraph = dynamic(
  () => import("../GitHubContributionGraph"),
  { ssr: false, loading: () => <div className="min-h-[200px]" /> }
);
const Experience = dynamic(() => import("../../Pages/Experience"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const Education = dynamic(() => import("../../Pages/Education"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const Portofolio = dynamic(() => import("../../Pages/Portofolio"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});
const Activities = dynamic(() => import("../../Pages/Activities"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const Blog = dynamic(() => import("../../Pages/Blog"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const ContactPage = dynamic(() => import("../../Pages/Contact"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});
const Footer = dynamic(() => import("../../Pages/Footer"), {
  ssr: true,
});

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
  const [hasInteracted, setHasInteracted] = useState(false);

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

  // Defer cursor animation bundle loading until user first moves mouse or clicks
  useEffect(() => {
    if (!isDesktop) return;
    const onUserInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("mousemove", onUserInteraction);
      window.removeEventListener("pointerdown", onUserInteraction);
    };
    window.addEventListener("mousemove", onUserInteraction, { passive: true });
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onUserInteraction);
      window.removeEventListener("pointerdown", onUserInteraction);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!showWelcome) {
      document.body.setAttribute("data-aos-easing", "ease-out-cubic");
      document.body.setAttribute("data-aos-duration", "500");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("aos-animate");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "-30px 0px 0px 0px", threshold: 0.05 }
      );

      const observeElements = () => {
        document.querySelectorAll("[data-aos]:not(.aos-animate)").forEach((el) => {
          observer.observe(el);
        });
      };

      observeElements();
      const timer = setTimeout(observeElements, 500);

      return () => {
        clearTimeout(timer);
        observer.disconnect();
        document.body.removeAttribute("data-aos-easing");
        document.body.removeAttribute("data-aos-duration");
      };
    }
  }, [showWelcome, portfolioData]);

  const pageContent = (
    <>
      <header>
        <Navbar />
      </header>
      <AnimatedBackground />

      <main id="main-content" className="relative z-10">
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
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            progress={loadingProgress}
            isLoaded={isDataLoaded}
            onLoadingComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      {isDesktop && hasInteracted && !showWelcome && (
        <>
          <SplashCursor />
          <TargetCursor spinDuration={2} hideDefaultCursor={false} />
        </>
      )}

      {isDesktop ? (
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={65}
          sparkCount={15}
          duration={400}
        >
          {pageContent}
        </ClickSpark>
      ) : (
        pageContent
      )}
    </>
  );
};

LandingPage.propTypes = {
  showWelcome: PropTypes.bool.isRequired,
  setShowWelcome: PropTypes.func.isRequired,
};

export default LandingPage;