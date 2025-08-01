import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "../../Pages/WelcomeScreen";
import SplashCursor from "../AnimationComponents/SplashCursor";
import ClickSpark from "../AnimationComponents/ClickSpark";
import Navbar from "../Navbar";
import AnimatedBackground from "../Background";
import Home from "../../Pages/Home";
import About from "../../Pages/About";
import Portofolio from "../../Pages/Portofolio";
import Blog from "../../Pages/Blog";
import ContactPage from "../../Pages/Contact";
import PropTypes from "prop-types";
import Education from "../../Pages/Education";
import Footer from "../../Pages/Footer";
import TargetCursor from "../AnimationComponents/TargetCursor";

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
            <div className="sticky top-0 z-50 bg-[#030014] backdrop-blur-sm shadow-lg">
              <Navbar />
            </div>
            <AnimatedBackground />

            <Home />
            <About />
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