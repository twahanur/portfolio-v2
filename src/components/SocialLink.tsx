import { memo } from "react";
import Magnet from "./AnimationComponents/Magnet";

function getSocialName(link: string, label?: string) {
  if (label) return label;
  if (!link) return "Social Profile";
  if (link.includes("github")) return "GitHub";
  if (link.includes("linkedin")) return "LinkedIn";
  if (link.includes("facebook")) return "Facebook";
  if (link.includes("twitter") || link.includes("x.com")) return "Twitter";
  if (link.includes("instagram")) return "Instagram";
  if (link.includes("youtube")) return "YouTube";
  if (link.includes("leetcode")) return "LeetCode";
  if (link.includes("codeforces")) return "Codeforces";
  return "Social Profile";
}

const SocialLinkBtn = memo(({ icon: Icon, link, label }: any) => {
  const socialLabel = getSocialName(link, label);
  return (
    <Magnet magnetStrength={3} padding={30}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={socialLabel}
        title={socialLabel}
        className="group relative p-3 inline-block cursor-target rounded-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </a>
    </Magnet>
  );
});

SocialLinkBtn.displayName = "SocialLink";
export default SocialLinkBtn;