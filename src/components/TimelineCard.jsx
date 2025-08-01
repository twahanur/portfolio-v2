import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css"; // Base styles are still needed

import { GraduationCap, NotebookPen, Briefcase, Star } from "lucide-react";

const TimelineCard = ({ data }) => {
  const sectionConfig = [
    {
      label: "Education",
      icon: <GraduationCap />,
      color: "rgb(233, 30, 99)", // Hot pink
    },
    {
      label: "Experience",
      icon: <Briefcase />,
      color: "rgb(33, 150, 243)", // Blue
    },
    {
      label: "Training",
      icon: <NotebookPen />,
      color: "rgb(255, 152, 0)", // Orange
    },
  ];

  // A helper to get the right data based on the section label
  const getSectionData = (label) => {
    switch (label) {
      case "Education":
        return data.academicQualification.map(item => ({
          title: item.examTitle,
          subtitle: item.institute,
          content: (
            <>
              <p><strong>Major:</strong> {item.major}</p>
              <p><strong>Result:</strong> {item.result}</p>
            </>
          ),
          date: `${item.passingYear}`,
        }));
      case "Experience":
        return data.employmentHistory.map(item => ({
          title: item.position,
          subtitle: item.company,
          content: (
            <>
              <p className="font-semibold">Expertise: <span className="font-normal">{item.areaOfExpertise} ({item.expertiseDuration})</span></p>
              <p className="mt-2">{item.duties}</p>
            </>
          ),
          date: `${item.startDate} – ${item.endDate}`,
          sortKey: item.startDate.split('-')[0] || item.startDate,
        }));
      case "Training":
        return data.trainingSummary.map(item => ({
          title: item.trainingTitle,
          subtitle: `${item.institute} (${item.location})`,
          content: <p><strong>Topics:</strong> {item.topics}</p>,
          date: `${item.year}`,
        }));
      default:
        return [];
    }
  };

  // Flatten all items into a single array for the timeline
  const timelineElements = sectionConfig.flatMap(section => {
    const items = getSectionData(section.label);
    
    const sortedItems = items.sort((a, b) => {
        const dateA = a.sortKey || a.date;
        const dateB = b.sortKey || b.date;
        return dateB.localeCompare(dateA);
    });

    return sortedItems.map((item, index) => (
      <VerticalTimelineElement
        key={`${section.label}-${item.title}-${index}`}
        date={item.date}
        icon={section.icon}
        iconStyle={{ background: section.color, color: "#fff" }}
        contentStyle={{ background: "transparent", boxShadow: "none", padding: "0" }}
        contentArrowStyle={{ borderRight: `7px solid ${section.color}` }}
      >
        {/* --- Pure Tailwind Card Starts Here --- */}
        <div 
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          style={{ borderTop: `4px solid ${section.color}` }}
        >
          <div className="p-6">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h4>
            <h5 className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
              {item.subtitle}
            </h5>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
              {item.content}
            </div>
          </div>
        </div>
        {/* --- Pure Tailwind Card Ends Here --- */}
      </VerticalTimelineElement>
    ));
  });

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-900">
      <VerticalTimeline>
        {timelineElements}
        <VerticalTimelineElement
          iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
          icon={<Star />}
        />
      </VerticalTimeline>
    </div>
  );
};

export default TimelineCard;