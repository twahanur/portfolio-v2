/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from "framer-motion";
import ClickSpark from "./components/AnimationComponents/ClickSpark";
import SplashCursor from "./components/AnimationComponents/SplashCursor";

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

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
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
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              showWelcome={showWelcome}
              setShowWelcome={setShowWelcome}
            />
          }
        />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
