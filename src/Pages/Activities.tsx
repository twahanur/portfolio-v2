"use client";

/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { motion, LayoutGroup } from "framer-motion";
import { Modal, IconButton, Box, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Activity,
  Maximize2,
  Sparkles,
} from "lucide-react";

// Default fallback activities if none provided
const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    title: "Hero Union 2026",
    status: "Participant as Alumni - Tech conference & community meetups.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    date: "2026-06-18",
    link: "#",
  },
  {
    id: "act-2",
    title: "ICPC Regional Contest",
    status: "Participated in ICPC Asia Regional Contest 2024.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop",
    date: "2024-12-07",
    link: "#",
  },
  {
    id: "act-3",
    title: "Intra University Programming Contest",
    status: "Mentor and Organizer for IUPC coding competition.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    date: "2023-12-07",
    link: "#",
  },
  {
    id: "act-4",
    title: "bdapps National Hackathon",
    status: "National Hackathon Round Khulna - Finalist project.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop",
    date: "2022-05-03",
    link: "#",
  },
  {
    id: "act-5",
    title: "Global Tech Summit",
    status: "Keynote & Panelist on Modern Web Systems.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop",
    date: "2025-09-15",
    link: "#",
  },
];

/*
 * 10 complex bento-grid layouts using explicit grid placement.
 * Each layout defines:
 *   - cols: grid-template-columns (CSS value)
 *   - rows: grid-template-rows (CSS value)
 *   - slots[]: { col, row, round? } for each of the 5 cards
 *     col/row are CSS grid-column/grid-row shorthand ("1 / 3" etc)
 *     round: true makes the card circular (for visual variety)
 */
const LAYOUTS = [
  // 0: Magazine spread — large hero left, 2 medium right, 2 small bottom-right
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1fr 1fr 1fr",
    slots: [
      { col: "1 / 3", row: "1 / 4" },              // big left
      { col: "3 / 5", row: "1 / 2" },              // top-right wide
      { col: "3 / 4", row: "2 / 3" },              // mid-right small
      { col: "4 / 5", row: "2 / 4" },              // right tall
      { col: "3 / 4", row: "3 / 4" },              // bottom-mid
    ],
  },
  // 1: Center hero with 4 corner cards
  {
    cols: "1fr 1.5fr 1.5fr 1fr",
    rows: "1fr 1fr 1fr",
    slots: [
      { col: "1 / 2", row: "1 / 2" },              // top-left
      { col: "2 / 4", row: "1 / 4" },              // center hero (big)
      { col: "4 / 5", row: "1 / 2" },              // top-right
      { col: "1 / 2", row: "2 / 4" },              // bottom-left tall
      { col: "4 / 5", row: "2 / 4" },              // bottom-right tall
    ],
  },
  // 2: T-shape — wide top banner, 3 bottom columns with one tall
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1.2fr 1fr 1fr",
    slots: [
      { col: "1 / 4", row: "1 / 2" },              // top wide banner
      { col: "4 / 5", row: "1 / 3" },              // right tall
      { col: "1 / 2", row: "2 / 4" },              // bottom-left tall
      { col: "2 / 3", row: "2 / 3" },              // mid-center
      { col: "2 / 4", row: "3 / 4" },              // bottom-center wide
    ],
  },
  // 3: Inverted L — right hero, stacked left column, bottom strip
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1fr 1fr 1fr",
    slots: [
      { col: "1 / 2", row: "1 / 2" },              // top-left
      { col: "1 / 2", row: "2 / 3" },              // mid-left
      { col: "2 / 5", row: "1 / 3" },              // right hero (big)
      { col: "1 / 3", row: "3 / 4" },              // bottom-left wide
      { col: "3 / 5", row: "3 / 4" },              // bottom-right wide
    ],
  },
  // 4: Cross pattern — center spotlight, 4 L-shaped corners
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1fr 1.4fr 1fr",
    slots: [
      { col: "1 / 3", row: "1 / 2" },              // top-left wide
      { col: "3 / 5", row: "1 / 2" },              // top-right wide
      { col: "2 / 4", row: "2 / 3" },              // center spotlight
      { col: "1 / 2", row: "2 / 4" },              // left tall
      { col: "4 / 5", row: "2 / 4" },              // right tall
    ],
  },
  // 5: Diagonal flow — staircase descending left to right
  {
    cols: "1fr 1fr 1fr",
    rows: "1fr 1fr 1fr",
    slots: [
      { col: "1 / 3", row: "1 / 2" },              // top wide
      { col: "3 / 4", row: "1 / 2" },              // top-right
      { col: "1 / 2", row: "2 / 3" },              // mid-left
      { col: "2 / 4", row: "2 / 3" },              // mid wide
      { col: "1 / 4", row: "3 / 4" },              // bottom full
    ],
  },
  // 6: Tetris blocks — asymmetric interlocking shapes
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1fr 1fr 1fr",
    slots: [
      { col: "1 / 3", row: "1 / 3" },              // top-left big square
      { col: "3 / 5", row: "1 / 2" },              // top-right wide
      { col: "3 / 4", row: "2 / 4" },              // mid-right tall
      { col: "4 / 5", row: "2 / 3" },              // small
      { col: "1 / 3", row: "3 / 4" },              // bottom wide (shifted down from big square)
    ],
  },
  // 7: Filmstrip — tall left column, 4 landscape right
  {
    cols: "1.3fr 1fr 1fr",
    rows: "1fr 1fr 1fr 1fr",
    slots: [
      { col: "1 / 2", row: "1 / 5" },              // tall filmstrip left
      { col: "2 / 4", row: "1 / 2" },              // right top wide
      { col: "2 / 3", row: "2 / 3" },              // mid-left
      { col: "3 / 4", row: "2 / 4" },              // mid-right tall
      { col: "2 / 3", row: "3 / 5" },              // bottom-left tall
    ],
  },
  // 8: Mondrian — art-inspired asymmetric blocks
  {
    cols: "1.5fr 1fr 1fr 1.5fr",
    rows: "1fr 1.2fr 1fr",
    slots: [
      { col: "1 / 2", row: "1 / 3" },              // left tall
      { col: "2 / 4", row: "1 / 2" },              // top-center wide
      { col: "4 / 5", row: "1 / 2" },              // top-right
      { col: "2 / 3", row: "2 / 4" },              // center tall
      { col: "3 / 5", row: "2 / 4" },              // right block
    ],
  },
  // 9: Zigzag — alternating wide and narrow rows
  {
    cols: "1fr 1fr 1fr 1fr",
    rows: "1fr 1.3fr 1fr",
    slots: [
      { col: "1 / 3", row: "1 / 2" },              // top-left wide
      { col: "3 / 5", row: "1 / 3" },              // right tall
      { col: "1 / 2", row: "2 / 4" },              // left tall
      { col: "2 / 4", row: "2 / 3" },              // center
      { col: "2 / 4", row: "3 / 4" },              // bottom-center wide
    ],
  },
];

// Smooth spring transition config for layout animations
const SPRING = {
  type: "spring",
  stiffness: 120,
  damping: 25,
  mass: 0.8,
};

export default function Activities({ activities }) {
  const itemList =
    activities && activities.length > 0 ? activities : DEFAULT_ACTIVITIES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  const DISPLAY_COUNT = 5;
  const ROTATION_INTERVAL = 5000;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemList.length);
    setLayoutIndex((prev) => (prev + 1) % LAYOUTS.length);
  }, [itemList.length]);

  // Continuous auto-rotation — only pauses during lightbox
  useEffect(() => {
    if (selectedImage) return;
    const timer = setInterval(handleNext, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [selectedImage, handleNext]);

  // Get current 5 items (wrapping around)
  const visibleItems = [];
  for (let i = 0; i < DISPLAY_COUNT; i++) {
    const idx = (currentIndex + i) % itemList.length;
    visibleItems.push({ ...itemList[idx], slotIndex: i });
  }

  const currentLayout = LAYOUTS[layoutIndex];

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-16 mt-10 bg-transparent overflow-hidden"
      id="Activities"
    >
      {/* Header */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <Sparkles size={14} className="animate-spin-slow text-purple-400" />
          <span>Dynamic Live Feed</span>
        </div>
        <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899]">
          Recent Activities
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-3 leading-relaxed">
          Here is a stream of my recent involvements, tech conferences, meetups,
          and major milestones.
        </p>
      </div>

      {/* Bento Grid Container — fixed aspect ratio prevents layout shifts */}
      <div className="w-full mx-auto" ref={containerRef}>
        <LayoutGroup>
          {/* Desktop: CSS Grid with explicit placement */}
          <div
            className="hidden md:grid gap-3 lg:gap-4"
            style={{
              gridTemplateColumns: currentLayout.cols,
              gridTemplateRows: currentLayout.rows,
              height: "620px",
              transition: "grid-template-columns 0.8s cubic-bezier(0.25, 1, 0.5, 1), grid-template-rows 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {visibleItems.map((item, slotIdx) => {
              const slot = currentLayout.slots[slotIdx];
              return (
                <BentoCard
                  key={`slot-${slotIdx}`}
                  item={item}
                  slotIdx={slotIdx}
                  gridColumn={slot.col}
                  gridRow={slot.row}
                  onImageClick={setSelectedImage}
                />
              );
            })}
          </div>

          {/* Mobile: stacked vertical layout */}
          <div className="md:hidden flex flex-col gap-4">
            {visibleItems.slice(0, 3).map((item, slotIdx) => (
              <BentoCard
                key={`mobile-slot-${slotIdx}`}
                item={item}
                slotIdx={slotIdx}
                gridColumn={undefined}
                gridRow={undefined}
                onImageClick={setSelectedImage}
                isMobile
              />
            ))}
          </div>
        </LayoutGroup>

        {/* Minimal dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {LAYOUTS.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                width: layoutIndex === idx ? 24 : 6,
                opacity: layoutIndex === idx ? 1 : 0.25,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          ))}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 350,
          sx: {
            backgroundColor: "rgba(3, 0, 20, 0.95)",
            backdropFilter: "blur(12px)",
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
                bgcolor: "rgba(168, 85, 247, 0.8)",
                transform: "scale(1.1)",
              },
            }}
            size="large"
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>

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
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

/* ─── Individual Bento Card with layoutId for smooth morphing ─── */
function BentoCard({ item, slotIdx, gridColumn, gridRow, onImageClick, isMobile = false }) {
  const activityDate = item.date ? new Date(item.date) : new Date();
  const dateStr = activityDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layoutId={`bento-slot-${slotIdx}`}
      layout="position"
      transition={SPRING}
      onClick={() => item.image && onImageClick(item.image)}
      style={{
        gridColumn: gridColumn,
        gridRow: gridRow,
        cursor: item.image ? "pointer" : "default",
      }}
      className={`group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 bg-slate-950/80 backdrop-blur-xl shadow-2xl flex flex-col justify-end ${
        isMobile ? "min-h-[220px]" : ""
      }`}
    >
      {/* Background Image */}
      {item.image ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title || "Activity capture"}
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
            loading="lazy"
          />
          {/* Multi-layer gradient for deep text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10 group-hover:via-slate-950/40 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-slate-950" />
      )}

      {/* Ambient glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

      {/* Top badges */}
      <div className="relative z-10 p-4 md:p-5 flex items-start justify-between gap-2 mb-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/50 border border-white/[0.12] rounded-full text-[11px] font-semibold text-slate-200 backdrop-blur-lg shadow-lg">
          <Calendar size={12} className="text-indigo-400" />
          {dateStr}
        </span>


      </div>

      {/* Bottom content overlay */}
      <div className="relative z-10 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-white tracking-tight leading-tight group-hover:text-purple-200 transition-colors duration-300 text-base md:text-lg line-clamp-2">
            {item.title || "Activity Update"}
          </h3>
          <Activity size={16} className="text-purple-400 shrink-0 mt-0.5" />
        </div>

        <p className="text-slate-300/90 leading-relaxed mb-3 text-xs md:text-sm line-clamp-2">
          {item.status}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <MapPin size={12} className="text-purple-400" />
            Milestone Event
          </span>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-purple-300 transition duration-200 group/link"
            >
              Details
              <ExternalLink
                size={12}
                className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

Activities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      status: PropTypes.string,
      image: PropTypes.string,
      link: PropTypes.string,
      date: PropTypes.string,
    })
  ),
};
