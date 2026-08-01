"use client";

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, memo } from "react";
import HeroSection from "../components/Hero/HeroSection";
import { fetchAiContext } from "../lib/api";

const Home = ({ profile: initialProfile, skills: initialSkills }) => {
  const [profileData, setProfileData] = useState(initialProfile);
  const [skillsData, setSkillsData] = useState(initialSkills);

  useEffect(() => {
    if (initialProfile) {
      setProfileData(initialProfile);
    }
    if (initialSkills) {
      setSkillsData(initialSkills);
    }

    if (!initialProfile) {
      const fetchProfile = async () => {
        try {
          const payload = await fetchAiContext();
          if (payload.success && payload.data) {
            if (payload.data.profile) {
              setProfileData(payload.data.profile);
            }
            if (payload.data.skills) {
              setSkillsData(payload.data.skills);
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile info in Home:", err);
        }
      };
      fetchProfile();
    }
  }, [initialProfile, initialSkills]);

  return <HeroSection profile={profileData} skills={skillsData} />;
};

export default memo(Home);
