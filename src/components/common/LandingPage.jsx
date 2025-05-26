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
            <Portofolio />
            <Blog />
            <ContactPage />
            <footer>
              <center>
                <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
                <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                  © 2023{" "}
                  <a href="https://flowbite.com/" className="hover:underline">
                    Twahanur™
                  </a>
                  . All Rights Reserved.
                </span>
              </center>
            </footer>
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