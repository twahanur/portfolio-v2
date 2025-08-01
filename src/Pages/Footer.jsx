import { useState } from "react";
import Magnet from "../components/AnimationComponents/Magnet";
import SocialLinkBtn from "../components/SocialLink";
import { DataStore } from "../assets/DataStore";

const { SOCIAL_LINKS } = DataStore;
const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 100; // Using the same -100px offset as your Navbar
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-[#030014] text-[#e2d3fd]">
      <div className="py-16 px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Let's Build Something New
          </h2>
          <p className="mt-4 text-lg text-[#c0b2e3] max-w-2xl mx-auto">
            Have a project in mind or just want to connect? I'm always open to
            discussing new ideas and opportunities.
          </p>
          <div className="mt-8">
            <a
              href="#Contact"
              onClick={(e) => scrollToSection(e, "#Contact")}
              className="inline-block px-8 py-3 font-semibold text-white bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              Get in Touch
            </a>
          </div>
          <div
            className="hidden sm:flex gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="1600"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <Magnet
                key={index}
                padding={10}
                disabled={false}
                magnetStrength={5}
              >
                <SocialLinkBtn key={index} {...social} />
              </Magnet>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-[#5f5a78]/30 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-[#a79cc7] order-2 sm:order-1 mt-4 sm:mt-0">
            © {year} Twahanur. All Rights Reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
