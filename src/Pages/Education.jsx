import TimelineCard from "../components/TimelineCard";
const TimelineData = {
  employmentHistory: [
    {
      position: "Officer of IT",
      duration: "1.9 yrs",
      startDate: "2023-07-12",
      endDate: "2025-05-30",
      company: "MB Agrotech Bd",
      areaOfExpertise: "Development",
      expertiseDuration: "1.8 yrs",
      duties: "Joining as officer of IT on MB Agrotech BD",
    },
    {
      position: "Part-time Frontend Designer",
      duration: "1.1 yrs",
      startDate: "2022-12-17",
      endDate: "2023-12-21",
      company: "Ahamed AIT",
      areaOfExpertise: "Front end Design",
      expertiseDuration: "1.0 yr",
      duties:
        "Maintaining responsive design and also shopify theme customization",
    },
  ],
  academicQualification: [
    {
      examTitle: "Bachelor of Science (BSc)",
      major: "Bachelor of Science - BS Computer Science",
      institute: "Northern University of Business & Technology Khulna",
      result: "Enrolled",
      passingYear: 2026,
      duration: "4 years",
    },
    {
      examTitle: "HSC",
      major: "Science",
      institute: "Govt. B.L. College Khulna",
      result: "CGPA: 5 out of 5",
      passingYear: 2020,
      duration: "2 years",
    },
    {
      examTitle: "SSC",
      major: "Science",
      institute: "Gutudia A.C.G.B. High School",
      result: "CGPA: 5 out of 5",
      passingYear: 2017,
      duration: "2 years",
    },
  ],
  trainingSummary: [
    {
      trainingTitle: "Advance Web Development",
      topics:
        "Basic web design, Next js, Advance query, Middleware, Authentication, PosgreSql",
      institute: "Apollo Next Level Development",
      country: "Bangladesh",
      location: "Online",
      year: 2023,
      duration: "1 year",
    },
    {
      trainingTitle: "Web Design",
      topics:
        "HTML, CSS, TAILWIND, JAVASCRIPT, REACT JS, NODE JS, MONGODB, EXPRESS",
      institute: "Programming-Hero",
      country: "Bangladesh",
      location: "Remote",
      year: 2021,
      duration: "1 year",
    },
  ],
};

export default function App() {
  return (
    <div className="px-4 py-10">
      <TimelineCard data={TimelineData} />
    </div>
  );
}
