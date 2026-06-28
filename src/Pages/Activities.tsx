"use client";

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, IconButton, Box, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Activity,
  ArrowDown,
} from "lucide-react";

// Reusable ToggleButton matching Portofolio style
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-4 py-2
      text-slate-300 
      hover:text-white 
      text-sm 
      font-semibold 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-xl
      border 
      border-white/10
      hover:border-purple-500/30
      backdrop-blur-md
      group
      relative
      overflow-hidden
      mx-auto
      mt-8
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "Show Less" : "Load More Activities"}
      <ArrowDown
        size={16}
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "rotate-180" : "group-hover:translate-y-0.5"}
        `}
      />
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

export default function Activities({ activities }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);

  // Auto adjust initial items based on window width
  useEffect(() => {
    setDisplayLimit(window.innerWidth < 768 ? 2 : 3);
  }, []);

  if (!activities || activities.length === 0) {
    return null;
  }

  const displayedActivities = isExpanded
    ? activities
    : activities.slice(0, displayLimit);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-16 mt-10 bg-transparent overflow-hidden"
      id="Activities"
    >
      {/* Header section */}
      <div
        className="text-center pb-12"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Recent Activities
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-3 leading-relaxed">
          Here is a stream of my recent involvements, tech conferences, meetups,
          and major milestones.
        </p>
      </div>

      {/* Modern Asymmetric Timeline Stream */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-0">
        {/* Glowing Gradient Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-[3px] bg-gradient-to-b from-[#6366f1] via-[#a855f7] to-transparent transform md:-translate-x-1/2" />

        <div className="space-y-12">
          {displayedActivities.map((act, index) => {
            const isLeft = index % 2 === 0;
            const activityDate = new Date(act.date);
            const dateStr = activityDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={act.id || index}
                className="relative flex flex-col md:flex-row md:items-center justify-between"
                data-aos={isLeft ? "fade-right" : "fade-left"}
                data-aos-duration="800"
              >
                {/* Timeline Dot with Glow Aura */}
                <div className="absolute left-[10px] md:left-1/2 top-4 md:top-auto w-4 h-4 rounded-full bg-[#a855f7] border-4 border-[#030014] transform md:-translate-x-1/2 z-10 shadow-[0_0_12px_#a855f7]">
                  <span className="absolute -inset-2 rounded-full bg-[#a855f7]/25 animate-ping" />
                </div>

                {/* Left Side (Desktop Only) / Align opposite to content */}
                <div
                  className={`hidden md:block w-[45%] ${isLeft ? "text-right" : "order-last text-left"}`}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-350">
                    <Calendar size={13} className="text-indigo-400" />
                    {dateStr}
                  </span>
                </div>

                {/* Content Card (Right Side on mobile, alternating on desktop) */}
                <div
                  className={`
                    w-full md:w-[45%] pl-8 md:pl-0 
                    ${isLeft ? "md:order-last" : ""}
                  `}
                >
                  <div className="group relative rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/25 p-5 md:p-6 backdrop-blur-xl shadow-xl transition-all duration-500">
                    {/* Ambient Glow Background Effect */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

                    {/* Mobile Only Date Badge */}
                    <div className="md:hidden flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold text-slate-400">
                        <Calendar size={11} className="text-indigo-400" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Top Tag or Title */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <h3 className="text-lg md:text-xl font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                        {act.title || "Activity Update"}
                      </h3>
                      <Activity
                        size={18}
                        className="text-purple-400 shrink-0 mt-1"
                      />
                    </div>

                    {/* Status Content */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {act.status}
                    </p>

                    {/* Optional Status Picture */}
                    {act.image && (
                      <div
                        onClick={() => setSelectedImage(act.image)}
                        className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-zinc-950/40 border border-white/5 hover:border-purple-500/20 cursor-zoom-in group/img mb-4"
                      >
                        <img
                          src={act.image}
                          alt={act.title || "Activity capture"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                          <span className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-medium text-white shadow-lg">
                            Click to View
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Metadata & Links */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-450 font-medium">
                        <MapPin size={12} className="text-[#a855f7]" />
                        Professional Event
                      </span>

                      {act.link ? (
                        <a
                          href={act.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#6366f1] hover:text-[#a855f7] transition duration-200 group/link"
                        >
                          Learn More
                          <ExternalLink
                            size={12}
                            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expand/Collapse Toggle Button */}
      {activities.length > displayLimit && (
        <ToggleButton onClick={toggleExpand} isShowingMore={isExpanded} />
      )}

      {/* Image Lightbox Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 350,
          sx: {
            backgroundColor: "rgba(3, 0, 20, 0.95)",
            backdropFilter: "blur(8px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "auto",
            maxWidth: "92vw",
            maxHeight: "92vh",
            outline: "none",
            "&:focus": { outline: "none" },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              zIndex: 5,
              padding: 1,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.85)",
                transform: "scale(1.1)",
              },
            }}
            size="large"
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Modal Image */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Activity Photo Full View"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "90vh",
                margin: "0 auto",
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

Activities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      status: PropTypes.string.isRequired,
      image: PropTypes.string,
      link: PropTypes.string,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
