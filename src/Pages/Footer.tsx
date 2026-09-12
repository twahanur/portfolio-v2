"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Instagram, Facebook, Twitter, Youtube, Globe } from "lucide-react";
import Magnet from "../components/AnimationComponents/Magnet";
import SocialLinkBtn from "../components/SocialLink";
import { fetchAiContext } from "../lib/api";

import LiveAnalyticsWidget from "../components/LiveAnalyticsWidget";
import NewsletterForm from "../components/NewsletterForm";

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data?.profile) {
          const p = payload.data.profile;
          const socials = [];
          if (p.github) socials.push({ icon: Github, link: p.github, label: "GitHub" });
          if (p.linkedin) socials.push({ icon: Linkedin, link: p.linkedin, label: "LinkedIn" });
          if (p.instagram) socials.push({ icon: Instagram, link: p.instagram, label: "Instagram" });
          if (p.facebook) socials.push({ icon: Facebook, link: p.facebook, label: "Facebook" });
          if (p.twitter) socials.push({ icon: Twitter, link: p.twitter, label: "Twitter" });
          if (p.youtube) socials.push({ icon: Youtube, link: p.youtube, label: "YouTube" });
          if (p.stackoverflow) socials.push({ icon: Globe, link: p.stackoverflow, label: "StackOverflow" });
          if (p.medium) socials.push({ icon: Globe, link: p.medium, label: "Medium" });
          if (p.devto) socials.push({ icon: Globe, link: p.devto, label: "Dev.to" });

          setSocialLinks(socials);
        }
      } catch (err) {
        console.error("Failed to fetch socials in footer:", err);
      }
    };
    fetchSocials();
  }, []);
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
    <footer className="bg-slate-50 dark:bg-[#030014] border-t border-slate-200 dark:border-transparent text-slate-650 dark:text-[#e2d3fd] transition-colors duration-300">
      <div className="py-16 md:px-[10%] px-[5%] w-full mx-auto space-y-12">

        {/* Live Analytics & Newsletter — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <LiveAnalyticsWidget />
          <NewsletterForm />
        </div>

        <div className="text-center pt-8 border-t border-slate-800/40">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Let&apos;s Build Something New
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-[#c0b2e3] max-w-2xl mx-auto">
            Have a project in mind or just want to connect? I&apos;m always open to
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
          {socialLinks.length > 0 && (
            <div
              className="hidden sm:flex gap-4 justify-center mt-6"
              data-aos="fade-up"
              data-aos-delay="1600"
            >
              {socialLinks.map((social, index) => (
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
          )}
        </div>
        <div className="border-t border-slate-250 dark:border-[#5f5a78]/30 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-[#a79cc7] order-2 sm:order-1 mt-4 sm:mt-0">
            © {year} Twahanur. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
