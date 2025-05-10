import {
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    Instagram,
  } from "lucide-react";

  const WORDS = [
    "Backend Developer",
    "Junior Developer",
    "Fullstack Developer",
    "Programming Enthusiast",
    "Tech Explorer",
  ];
const TECH_STACK = [
    "React",
    "Next",
    "Node.js",
    "Prisma",
    "Postgresql",
    "MongoDB",
  ];
  const SOCIAL_LINKS = [
    { icon: Github, link: "https://github.com/twahanur" },
    { icon: Linkedin, link: "https://www.linkedin.com/in/twahanur/" },
    { icon: Instagram, link: "https://www.instagram.com/twahanur/?hl=id" },
  ];

  export const DataStore = { SOCIAL_LINKS, TECH_STACK,WORDS };
  