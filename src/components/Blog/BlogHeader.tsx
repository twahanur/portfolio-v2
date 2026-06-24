import DecryptedText from "../AnimationComponents/DecryotedText";

const BlogHeader = () => {
  return (
    <div className="text-center lg:mb-8 mb-2 px-[5%]">
      <div className="inline-block relative group">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          <DecryptedText
            text="Tech Talks"
            speed={120}
            sequential={false}
            animateOn="view"
            revealDirection="center"
          />
        </h2>
       <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Dive into insightful articles on programming, web development, and emerging technologies. &quot;Tech Talk&quot; is where I share lessons learned, tips, and deep dives from real-world coding experiences and ongoing explorations in the tech world
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;
