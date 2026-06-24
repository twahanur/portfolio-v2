"use client";

/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import Certificate from "../components/Certificate";
import PortfolioHeader from "../components/Portfolio/PortfolioHeader";
import PortfolioAppbar from "../components/Portfolio/PortfolioAppbar";

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${
            isShowingMore
              ? "group-hover:-translate-y-0.5"
              : "group-hover:translate-y-0.5"
          }
        `}
      >
        <polyline
          points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
        ></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function FullWidthTabs({ projects: propProjects, certificates: propCertificates }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [initialItems, setInitialItems] = useState(6);
  useEffect(() => {
    setInitialItems(window.innerWidth < 768 ? 4 : 6);
  }, []);

  const formatProjects = useCallback((data) => {
    return data.map((p) => {
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
  }, []);

  const formatCertificates = useCallback((data) => {
    return data.map((c) => ({
      id: c.id,
      Img: c.imageUrl,
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
    }));
  }, []);

  useEffect(() => {
    if (propProjects || propCertificates) {
      if (propProjects) {
        setProjects(formatProjects(propProjects));
      }
      if (propCertificates) {
        setCertificates(formatCertificates(propCertificates));
      }
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const [resProjects, resCertificates] = await Promise.all([
          fetch(`${apiUrl}/api/projects`),
          fetch(`${apiUrl}/api/certificates`),
        ]);

        if (resProjects.ok && resCertificates.ok) {
          const payloadProjects = await resProjects.json();
          const payloadCertificates = await resCertificates.json();

          if (payloadProjects.success && payloadCertificates.success) {
            const projectData = formatProjects(payloadProjects.data);
            const certificateData = formatCertificates(payloadCertificates.data);

            setProjects(projectData);
            setCertificates(certificateData);

            // Store in localStorage
            localStorage.setItem("projects", JSON.stringify(projectData));
            localStorage.setItem("certificates", JSON.stringify(certificateData));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [propProjects, propCertificates, formatProjects, formatCertificates]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, initialItems);

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-transparent overflow-hidden"
      id="Portofolio"
    >
      
      {/* Header section - unchanged */}
      <PortfolioHeader />

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <PortfolioAppbar value={value} handleChange={handleChange} />

        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="container mx-auto flex justify-center items-center overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {displayedProjects.map((project, index) => (
                <div
                  key={project.id || index}
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay={`${(index % 3) * 80}`}
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    id={project.id}
                  />
                </div>
              ))}
            </div>
          </div>
          {projects.length > initialItems && (
            <div className="mt-6 w-full flex justify-start">
              <ToggleButton
                onClick={() => toggleShowMore("projects")}
                isShowingMore={showAllProjects}
              />
            </div>
          )}
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className="container mx-auto flex justify-center items-center overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
              {displayedCertificates.map((certificate, index) => (
                <div
                  key={index}
                  data-aos={
                    index % 3 === 0
                      ? "fade-up-right"
                      : index % 3 === 1
                      ? "fade-up"
                      : "fade-up-left"
                  }
                  data-aos-duration={
                    index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"
                  }
                >
                  <Certificate ImgSertif={certificate.Img} />
                </div>
              ))}
            </div>
          </div>
          {certificates.length > initialItems && (
            <div className="mt-6 w-full flex justify-start">
              <ToggleButton
                onClick={() => toggleShowMore("certificates")}
                isShowingMore={showAllCertificates}
              />
            </div>
          )}
        </TabPanel>

      </Box>
    </div>
  );
}
