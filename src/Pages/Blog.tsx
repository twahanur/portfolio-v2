"use client";

/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";

import BlogHeader from "../components/Blog/BlogHeader";
import BlogCard from "../components/Blog/BlogCard";

const formatBlogs = (data) => {
  if (!data) return [];
  return data.map((b) => ({
    id: b.id,
    Title: b.title,
    Description: b.description,
    Img: b.image,
    Image: b.image,
    Author: b.author,
    Keywords: b.keywords || [],
    PublishedAt: b.publishedAt,
  }));
};

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isShowingMore ? "Show fewer articles" : "Show more articles"}
    className="
      px-3 py-1.5
      text-slate-700 dark:text-slate-300 
      hover:text-slate-950 dark:hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-slate-100 dark:bg-white/5 
      hover:bg-slate-200 dark:hover:bg-white/10
      rounded-md
      border 
      border-slate-300 dark:border-white/10
      hover:border-slate-400 dark:hover:border-white/20
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
        aria-hidden="true"
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

export default function FullWidthTabs({ blogs: propBlogs }) {
  const [blogs, setBlogs] = useState(() => (propBlogs ? formatBlogs(propBlogs) : []));
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [initialItems, setInitialItems] = useState(6);

  useEffect(() => {
    setInitialItems(window.innerWidth < 768 ? 4 : 6);
  }, []);

  useEffect(() => {
    if (propBlogs) {
      setBlogs(formatBlogs(propBlogs));
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/blogs`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success) {
            const blogtData = formatBlogs(payload.data);
            setBlogs(blogtData);
            // Store in localStorage
            localStorage.setItem("blogs", JSON.stringify(blogtData));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [propBlogs]);

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
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-transparent overflow-hidden"
      id="Blog"
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
                className="h-full"
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
