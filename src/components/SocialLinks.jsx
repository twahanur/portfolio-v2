"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Globe,
  ExternalLink
} from "lucide-react";

const SOCIAL_CONFIGS = [
  {
    key: "linkedin",
    name: "LinkedIn",
    displayName: "LinkedIn",
    subText: "Let's Connect",
    icon: Linkedin,
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]"
  },
  {
    key: "github",
    name: "GitHub",
    displayName: "Github",
    subText: "My Repositories",
    icon: Github,
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]"
  },
  {
    key: "instagram",
    name: "Instagram",
    displayName: "Instagram",
    subText: "Follow Me",
    icon: Instagram,
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]"
  },
  {
    key: "youtube",
    name: "YouTube",
    displayName: "Youtube",
    subText: "Watch my videos",
    icon: Youtube,
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]"
  },
  {
    key: "facebook",
    name: "Facebook",
    displayName: "Facebook",
    subText: "Connect on FB",
    icon: Facebook,
    color: "#1877F2",
    gradient: "from-[#1877F2] to-[#0052D4]"
  },
  {
    key: "twitter",
    name: "Twitter",
    displayName: "Twitter / X",
    subText: "Follow my updates",
    icon: Twitter,
    color: "#1DA1F2",
    gradient: "from-[#1DA1F2] to-[#0E71EB]"
  },
  {
    key: "stackoverflow",
    name: "StackOverflow",
    displayName: "StackOverflow",
    subText: "Developer Profile",
    icon: Globe,
    color: "#F48024",
    gradient: "from-[#F48024] to-[#BCBBBB]"
  },
  {
    key: "medium",
    name: "Medium",
    displayName: "Medium",
    subText: "Read my articles",
    icon: Globe,
    color: "#00ab6c",
    gradient: "from-[#00ab6c] to-[#007d4f]"
  },
  {
    key: "devto",
    name: "Dev.to",
    displayName: "Dev.to",
    subText: "Developer stories",
    icon: Globe,
    color: "#0a0a0a",
    gradient: "from-[#0a0a0a] to-[#24292e]"
  }
];

export default function SocialLinks() {
  const [profile, setProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/ai-context`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data?.profile) {
            setProfile(payload.data.profile);
          }
        }
      } catch (err) {
        console.error("Failed to fetch socials:", err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchSocials();
  }, []);

  const activeSocials = useMemo(() => {
    if (!profile) return [];
    return SOCIAL_CONFIGS.map((cfg) => {
      const url = profile[cfg.key];
      if (url && url.trim()) {
        // Simple extraction of username from URL for subText if needed, or fallback to default subText
        let customSubText = cfg.subText;
        try {
          const parsed = new URL(url);
          const path = parsed.pathname.replace(/^\/|\/$/g, "");
          if (path && path.length > 0 && !path.includes("/")) {
            customSubText = `@${path}`;
          }
        } catch (e) {
          // ignore
        }
        return {
          ...cfg,
          url,
          subText: customSubText,
        };
      }
      return null;
    }).filter(Boolean);
  }, [profile]);

  if (!hasLoaded || activeSocials.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        Connect With Me
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSocials.map((link) => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 p-4 rounded-xl 
                     bg-white/5 border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-500"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                           bg-gradient-to-r ${link.gradient}`} />
            
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                             group-hover:scale-125 group-hover:opacity-30"
                   style={{ backgroundColor: link.color }} />
              <div className="relative p-2 rounded-lg">
                <link.icon
                  className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                  style={{ color: link.color }}
                />
              </div>
            </div>

            {/* Text Container */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                {link.displayName}
              </span>
              <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                {link.subText}
              </span>
            </div>
            
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                   opacity-0 group-hover:opacity-100 transition-all duration-300
                                   transform group-hover:translate-x-0 -translate-x-2" />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}