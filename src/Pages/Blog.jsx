/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import AOS from "aos";
import "aos/dist/aos.css";
import BlogHeader from "../components/Blog/BlogHeader";
import BlogCard from "../components/Blog/BlogCard";

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

export default function FullWidthTabs() {
  const [blogs, setBlogs] = useState([]);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const blogCollection = collection(db, "blogs");

      const [blogSnapshot] =
        await Promise.all([
          getDocs(blogCollection),
        ]);

      const blogtData = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(blogtData);
      // Store in localStorage
      localStorage.setItem("blogs", JSON.stringify(blogtData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleShowMore = useCallback((type) => {
    if (type === "blogs") {
      setShowAllBlogs((prev) => !prev);
    }
  }, []);

  const displayedBlogs = showAllBlogs
    ? blogs
    : blogs.slice(0, initialItems);

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden"
      id="Portofolio"
    >
      {/* Header section - unchanged */}
      <BlogHeader />

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}

        <div className="container mx-auto flex justify-center items-center overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {displayedBlogs.map((project, index) => (
              <div
                key={project.id || index}
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
                <BlogCard
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
        {blogs.length > initialItems && (
          <div className="mt-6 w-full flex justify-start">
            <ToggleButton
              onClick={() => toggleShowMore("blogs")}
              isShowingMore={showAllBlogs}
            />
          </div>
        )}
      </Box>
    </div>
  );
}
