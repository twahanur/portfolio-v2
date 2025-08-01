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
        <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Education Section
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through Education, Coursec, and Experiences. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>
      <TimelineCard data={TimelineData} />
    </div>
  );
}
