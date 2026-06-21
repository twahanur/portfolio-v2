"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import WelcomeScreen from "../../Pages/WelcomeScreen";
import Navbar from "../Navbar";
import AnimatedBackground from "../Background";
import Home from "../../Pages/Home";
import About from "../../Pages/About";
import Portofolio from "../../Pages/Portofolio";
import Blog from "../../Pages/Blog";
import ContactPage from "../../Pages/Contact";
import PropTypes from "prop-types";
import Education from "../../Pages/Education";
import Experience from "../../Pages/Experience";
import TechStackPage from "../../Pages/TechStack";
import Footer from "../../Pages/Footer";

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
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
        <SplashCursor/>
        <TargetCursor
                spinDuration={2}
                hideDefaultCursor={false}
              />
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={65}
            sparkCount={15}
            duration={400}
          >
            <div className="sticky top-0 z-50 bg-white dark:bg-[#030014] backdrop-blur-sm shadow-lg">
              <Navbar />
            </div>
            <AnimatedBackground />

            <Home />
            <About />
            <TechStackPage />
            <Experience />
            <Education />
            <Portofolio />
            <Blog />
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