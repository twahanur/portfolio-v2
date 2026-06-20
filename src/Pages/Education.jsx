"use client";

import { useEffect, useState } from "react";
import TimelineCard from "../components/TimelineCard";
import { fetchAiContext } from "../lib/api";

export default function EducationPage() {
  const [timelineData, setTimelineData] = useState({ academicQualification: [], trainingSummary: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data) {
          const data = payload.data;

            // Map educations
            const educations = (data.educations || []).map((edu) => ({
              id: edu.id,
              examTitle: edu.examTitle,
              major: edu.major,
              institute: edu.institute,
              result: edu.result,
              passingYear: edu.passingYear,
              duration: edu.duration,
              order: edu.order,
            }));

            setTimelineData({
              academicQualification: educations,
              trainingSummary: [],
            });
          }
      } catch (err) {
        console.error("Failed to fetch education data:", err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchEducation();
  }, []);

  // If data hasn't loaded yet or there are no education/training entries in the database, do not render this section
  if (!hasLoaded || (timelineData.academicQualification.length === 0 && timelineData.trainingSummary.length === 0)) {
    return null;
  }

  return (
    <div className="px-4 py-16 bg-[#030014]/30 relative overflow-hidden" id="education">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center pb-12" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-extrabold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">
          Education
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xs md:text-sm mt-3 tracking-wide uppercase font-semibold">
          My academic qualifications
        </p>
      </div>

      <TimelineCard data={timelineData} />
    </div>
  );
}
