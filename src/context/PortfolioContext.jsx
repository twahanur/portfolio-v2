'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAiContext } from '../lib/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  useEffect(() => {
    // If already loaded, don't fetch again
    if (isDataLoaded) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    let completed = 0;
    const totalSteps = 10; // Granular loading steps matching the previous implementation

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

        // Cache in localStorage for backward compatibility with pages relying on it
        if (typeof window !== "undefined") {
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
  }, [isDataLoaded]);

  return (
    <PortfolioContext.Provider
      value={{
        showWelcome,
        setShowWelcome,
        loadingProgress,
        isDataLoaded,
        portfolioData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
