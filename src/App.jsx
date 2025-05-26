/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";
import ProjectPageLayout from "./components/common/ProjectLayout";
import LandingPage from "./components/common/LandingPage";
import BlogLayout from "./components/common/BlogLayout";
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
        <Route path="/blog/:id" element={<BlogLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
