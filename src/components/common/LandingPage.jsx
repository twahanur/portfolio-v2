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
import Blog from "../../Pages/Blog";
import ContactPage from "../../Pages/Contact";
import PropTypes from "prop-types";
import Education from "../../Pages/Education";
import Experience from "../../Pages/Experience";
import TechStackPage from "../../Pages/TechStack";
import Footer from "../../Pages/Footer";
import { fetchAiContext } from "../../lib/api";
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    profile: null,
    skills: [],
    skillCategories: [],
    educations: [],
    experiences: [],
    projects: [],
    certificates: [],
    blogs: [],
    cv: null,
  });

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

  // Concurrent database loading
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    let completed = 0;
    const totalSteps = 10; // More granular for smoother progress

    const incrementProgress = (steps = 1) => {
      completed += steps;
      setLoadingProgress(Math.min(Math.floor((completed / totalSteps) * 100), 100));
    };

    const loadAllData = async () => {
      try {
        // Start progress immediately
        incrementProgress(1);

        const aiContextPromise = fetchAiContext()
          .then((res) => {
            incrementProgress(2);
            return res;
          })
          .catch((err) => {
            console.error("AI Context fetch failed:", err);
            incrementProgress(2);
            return null;
          });

        const projectsPromise = fetch(`${apiUrl}/api/projects`)
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            incrementProgress(2);
            return res;
          })
          .catch((err) => {
            console.error("Projects fetch failed:", err);
            incrementProgress(2);
            return null;
          });

        const certificatesPromise = fetch(`${apiUrl}/api/certificates`)
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            incrementProgress(2);
            return res;
          })
          .catch((err) => {
            console.error("Certificates fetch failed:", err);
            incrementProgress(2);
            return null;
          });

        const blogsPromise = fetch(`${apiUrl}/api/blogs`)
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            incrementProgress(1);
            return res;
          })
          .catch((err) => {
            console.error("Blogs fetch failed:", err);
            incrementProgress(1);
            return null;
          });

        const cvPromise = fetch(`${apiUrl}/api/resume/active`)
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            incrementProgress(1);
            return res;
          })
          .catch((err) => {
            console.error("CV fetch failed:", err);
            incrementProgress(1);
            return null;
          });

        const [aiContext, projects, certificates, blogs, cv] = await Promise.all([
          aiContextPromise,
          projectsPromise,
          certificatesPromise,
          blogsPromise,
          cvPromise,
        ]);

        const mergedData = {
          profile: aiContext?.success ? aiContext.data.profile : null,
          skills: aiContext?.success ? aiContext.data.skills : [],
          skillCategories: aiContext?.success ? aiContext.data.skillCategories : [],
          educations: aiContext?.success ? aiContext.data.educations : [],
          experiences: aiContext?.success ? aiContext.data.experiences : [],
          projects: projects?.success ? projects.data : [],
          certificates: certificates?.success ? certificates.data : [],
          blogs: blogs?.success ? blogs.data : [],
          cv: cv?.success && cv.data ? { Link: cv.data.url } : null,
        };

        // Cache in localStorage to match the existing requirements of some pages
        if (mergedData.projects.length > 0) {
          const projectData = mergedData.projects.map((p) => {
            const featuredImage = p.images?.find((img) => img.isFeatured) || p.images?.[0];
            return {
              id: p.id,
              Title: p.title,
              Description: p.description,
              Link: p.live,
              Github: p.code,
              TechStack: p.tags ? p.tags.map((t) => typeof t === "object" && t.tag ? t.tag.name : t) : [],
              Features: (p.metrics && p.metrics.length > 0) ? p.metrics : (p.features || []),
              Img: featuredImage ? featuredImage.url : "",
            };
          });
          localStorage.setItem("projects", JSON.stringify(projectData));
        }

        if (mergedData.certificates.length > 0) {
          const certificateData = mergedData.certificates.map((c) => ({
            id: c.id,
            Img: c.imageUrl,
            name: c.name,
            issuer: c.issuer,
            issueDate: c.issueDate,
            credentialId: c.credentialId,
            credentialUrl: c.credentialUrl,
          }));
          localStorage.setItem("certificates", JSON.stringify(certificateData));
        }

        if (mergedData.blogs.length > 0) {
          const blogtData = mergedData.blogs.map((b) => ({
            id: b.id,
            Title: b.title,
            Description: b.description,
            Img: b.image,
            Image: b.image,
            Author: b.author,
            Keywords: b.keywords || [],
            PublishedAt: b.publishedAt,
          }));
          localStorage.setItem("blogs", JSON.stringify(blogtData));
        }

        setPortfolioData(mergedData);
        setLoadingProgress(100);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Unified load failed:", err);
        setLoadingProgress(100);
        setIsDataLoaded(true);
      }
    };

    loadAllData();
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
            <div className="sticky top-0 z-50 bg-white dark:bg-[#030014] backdrop-blur-sm shadow-lg">
              <Navbar />
            </div>
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
            <Experience experiences={portfolioData.experiences} />
            <Education educations={portfolioData.educations} />
            <Portofolio
              projects={portfolioData.projects}
              certificates={portfolioData.certificates}
            />
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