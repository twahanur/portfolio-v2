"use client";

import { useEffect, useState } from "react";
import TimelineCard from "../components/TimelineCard";

export default function ExperiencePage() {
  const [timelineData, setTimelineData] = useState({ employmentHistory: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/ai-context`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data) {
            const data = payload.data;

            // Map experiences
            const experiences = (data.experiences || []).map((exp) => {
              const parts = exp.period ? exp.period.split(/\s*[-–—]\s*/) : [];
              const startDate = parts[0] || exp.period || "";
              const endDate = exp.isCurrent ? "Present" : (parts[1] || "");
              return {
                id: exp.id,
                position: exp.role,
                company: exp.company,
                duration: exp.duration,
                startDate: startDate,
                endDate: endDate,
                period: exp.period,
                areaOfExpertise: (exp.techStack || []).slice(0, 3).join(", "),
                expertiseDuration: exp.duration,
                duties: exp.summary,
                highlights: exp.highlights || [],
                techStack: exp.techStack || [],
                location: exp.location,
                workMode: exp.workMode,
                isCurrent: exp.isCurrent,
                order: exp.order,
              };
            });

            setTimelineData({
              employmentHistory: experiences,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch experience data:", err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchExperience();
  }, []);

  // If data hasn't loaded yet or there are no experience entries in the database, do not render this section
  if (!hasLoaded || timelineData.employmentHistory.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-16 bg-[#030014]/20 relative overflow-hidden" id="experience">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center pb-12" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          Work Experience
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xs md:text-sm mt-3 tracking-wide uppercase font-semibold">
          A history of my professional engineering contributions and achievements
        </p>
      </div>

      <TimelineCard data={timelineData} />
    </div>
  );
}
