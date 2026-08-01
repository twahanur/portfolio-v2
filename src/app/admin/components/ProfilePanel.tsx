"use client";

import { useState, useEffect } from "react";
import { Profile } from "../types";
import { adminRequest, uploadImage } from "@/lib/admin-api";
import { FiLoader, FiUser, FiCamera, FiLink, FiMapPin, FiPhone } from "react-icons/fi";
import Image from "next/image";
import FormField from "./ui/FormField";
import AdminMessage from "./ui/AdminMessage";

interface ProfilePanelProps {
  initialProfile: Profile | null;
  onRefresh: () => void;
}

export default function ProfilePanel({ initialProfile, onRefresh }: ProfilePanelProps) {
  // Core Bio info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [bio, setBio] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [heroAnimationUrl, setHeroAnimationUrl] = useState("");
  const [audioBioUrl, setAudioBioUrl] = useState("");

  // Contact details
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");

  // Social Links
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [stackoverflow, setStackoverflow] = useState("");
  const [medium, setMedium] = useState("");
  const [devto, setDevto] = useState("");

  // Availability states
  const [availStatus, setAvailStatus] = useState("");
  const [availStatusType, setAvailStatusType] = useState("available");
  const [availNotice, setAvailNotice] = useState("");
  const [availRolesText, setAvailRolesText] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || "");
      setEmail(initialProfile.email || "");
      setTitle(initialProfile.title || "");
      setWords(initialProfile.words || "");
      setBio(initialProfile.bio || "");
      setShortBio(initialProfile.shortBio || "");
      setProfilePictureUrl(initialProfile.profilePictureUrl || "");
      setHeroAnimationUrl(initialProfile.heroAnimationUrl || "");
      setAudioBioUrl((initialProfile as any).audioBioUrl || "");
      setPhone(initialProfile.phone || "");
      setLocation(initialProfile.location || "");
      setMapEmbedUrl(initialProfile.mapEmbedUrl || "");
      setGithub(initialProfile.github || "");
      setLinkedin(initialProfile.linkedin || "");
      setTwitter(initialProfile.twitter || "");
      setFacebook(initialProfile.facebook || "");
      setInstagram(initialProfile.instagram || "");
      setYoutube(initialProfile.youtube || "");
      setStackoverflow(initialProfile.stackoverflow || "");
      setMedium(initialProfile.medium || "");
      setDevto(initialProfile.devto || "");
    }
  }, [initialProfile]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await adminRequest("/api/availability");
        if (res.success && res.data) {
          setAvailStatus(res.data.status || "");
          setAvailStatusType(res.data.statusType || "available");
          setAvailNotice(res.data.notice || "");
          const roles = Array.isArray(res.data.preferredRoles)
            ? res.data.preferredRoles
            : typeof res.data.preferredRoles === "string"
            ? JSON.parse(res.data.preferredRoles || "[]")
            : [];
          setAvailRolesText(roles.join(", "));
        }
      } catch (err) {
        console.error("Failed to load availability config", err);
      }
    };
    fetchAvailability();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const url = await uploadImage(file);
      setProfilePictureUrl(url);
      showMessage("Profile picture uploaded successfully! Click 'Save Changes' at the bottom to persist it.", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await Promise.all([
        adminRequest("/api/auth/profile", "PUT", {
          name,
          email,
          title,
          words,
          bio,
          shortBio,
          profilePictureUrl,
          heroAnimationUrl,
          audioBioUrl,
          phone,
          location,
          mapEmbedUrl,
          github,
          linkedin,
          twitter,
          facebook,
          instagram,
          youtube,
          stackoverflow,
          medium,
          devto,
        }),
        adminRequest("/api/availability", "PUT", {
          status: availStatus,
          statusType: availStatusType,
          notice: availNotice,
          preferredRoles: availRolesText.split(",").map((r) => r.trim()).filter(Boolean),
        }),
      ]);
      showMessage("Profile & Work Availability updated successfully!", "success");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-md">
      <div>
        <h3 className="text-xl font-bold text-zinc-100">Admin Profile</h3>
        <p className="text-xs text-zinc-400">Update your public biography, dynamic contact channels, and social media networks</p>
      </div>

      <AdminMessage
        text={message.text}
        type={message.type as "success" | "error" | ""}
        onDismiss={() => setMessage({ text: "", type: "" })}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Avatar & Bio section */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center border-b border-zinc-900/60 pb-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-zinc-850 bg-zinc-950">
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt="Profile avatar"
                  fill
                  className="object-cover animate-in fade-in duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-650 bg-zinc-950">
                  <FiUser size={40} />
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 hover:opacity-100">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <FiLoader className="animate-spin text-zinc-200" size={20} />
                ) : (
                  <FiCamera className="text-zinc-200" size={24} />
                )}
              </label>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-200 text-sm">Avatar Photo</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Supports PNG, JPG, JPEG or WEBP. Uploaded directly to Cloudinary storage.
              </p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-950 transition active:scale-95">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? "Uploading..." : "Upload Photo"}
              </label>
            </div>
          </div>

          <h4 className="font-bold text-zinc-250 text-sm border-l-2 border-emerald-500 pl-3">Biography Settings</h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Full Name"
              required
              value={name}
              onChange={setName}
            />

            <FormField
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={setEmail}
            />

            <FormField
              label="Professional Title"
              required
              fullWidth
              placeholder="e.g. Full-Stack Backend-Focused Engineer"
              value={title}
              onChange={setTitle}
            />

            <FormField
              label="Homepage Rotating Words (comma-separated)"
              required
              fullWidth
              placeholder="e.g. Backend Developer, Junior Developer, Fullstack Developer"
              value={words}
              onChange={setWords}
            />

            <FormField
              label="Homepage Hero Animation URL (Lottie JSON / GIF / Image)"
              fullWidth
              placeholder="e.g. https://lottie.host/...json or URL to a GIF/image"
              value={heroAnimationUrl}
              onChange={setHeroAnimationUrl}
            />

            <FormField
              label="30-Sec Audio Bio / Voice Greeting URL (MP3/OGG)"
              fullWidth
              placeholder="e.g. https://res.cloudinary.com/.../voice-greeting.mp3"
              value={audioBioUrl}
              onChange={setAudioBioUrl}
            />

            <FormField
              label="Profile Biography (Bio)"
              type="textarea"
              rows={4}
              required
              fullWidth
              value={bio}
              onChange={setBio}
            />

            <FormField
              label="Homepage Hero Biography (Short Bio)"
              type="textarea"
              rows={3}
              required
              fullWidth
              placeholder="A brief 1-2 sentence biography for the homepage hero section..."
              value={shortBio}
              onChange={setShortBio}
            />
          </div>
        </div>

        {/* Contact info section */}
        <div className="space-y-6 pt-4 border-t border-zinc-900/60">
          <h4 className="font-bold text-zinc-250 text-sm border-l-2 border-emerald-500 pl-3 flex items-center gap-2">
            <FiPhone className="text-emerald-450" size={14} />
            Contact Channels
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="WhatsApp Phone Number"
              placeholder="+8801700000000"
              value={phone}
              onChange={setPhone}
            />

            <FormField
              label="Location (Display)"
              placeholder="Dhaka, Bangladesh"
              value={location}
              onChange={setLocation}
            />

            <FormField
              label="Google Map Embed URL"
              fullWidth
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={mapEmbedUrl}
              onChange={setMapEmbedUrl}
            />
          </div>
        </div>

        {/* Social media connections */}
        <div className="space-y-6 pt-4 border-t border-zinc-900/60">
          <h4 className="font-bold text-zinc-250 text-sm border-l-2 border-emerald-500 pl-3 flex items-center gap-2">
            <FiLink className="text-emerald-450" size={14} />
            Social Profiles
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              label="GitHub Profile URL"
              placeholder="https://github.com/username"
              value={github}
              onChange={setGithub}
            />

            <FormField
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/username"
              value={linkedin}
              onChange={setLinkedin}
            />

            <FormField
              label="Twitter / X URL"
              placeholder="https://x.com/username"
              value={twitter}
              onChange={setTwitter}
            />

            <FormField
              label="Facebook Profile URL"
              placeholder="https://facebook.com/username"
              value={facebook}
              onChange={setFacebook}
            />

            <FormField
              label="Instagram Profile URL"
              placeholder="https://instagram.com/username"
              value={instagram}
              onChange={setInstagram}
            />

            <FormField
              label="YouTube Channel URL"
              placeholder="https://youtube.com/@channel"
              value={youtube}
              onChange={setYoutube}
            />

            <FormField
              label="StackOverflow Profile URL"
              placeholder="https://stackoverflow.com/users/id/name"
              value={stackoverflow}
              onChange={setStackoverflow}
            />

            <FormField
              label="Medium Profile URL"
              placeholder="https://medium.com/@username"
              value={medium}
              onChange={setMedium}
            />

            <FormField
              label="Dev.to Profile URL"
              placeholder="https://dev.to/username"
              value={devto}
              onChange={setDevto}
            />
          </div>
        </div>

        {/* Work Availability Status Section */}
        <div className="space-y-6 pt-4 border-t border-zinc-900/60">
          <h4 className="font-bold text-zinc-250 text-sm border-l-2 border-emerald-500 pl-3">
            Work Availability Settings
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Availability Status Banner"
              placeholder="e.g. Available for Full-time Remote Roles & Select Freelance Projects"
              value={availStatus}
              onChange={setAvailStatus}
            />

            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-300">Status Type</label>
              <select
                value={availStatusType}
                onChange={(e) => setAvailStatusType(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="available">Available 🟢</option>
                <option value="busy">Busy / Fully Booked 🔴</option>
                <option value="open">Open for Inquiries 🟡</option>
              </select>
            </div>

            <FormField
              label="Notice Period"
              placeholder="e.g. Can start within 1-2 weeks"
              value={availNotice}
              onChange={setAvailNotice}
            />

            <FormField
              label="Preferred Roles (Comma Separated)"
              placeholder="e.g. Full-Stack Engineer, Backend Developer, System Architect"
              value={availRolesText}
              onChange={setAvailRolesText}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-900/60">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-black text-zinc-950 shadow hover:bg-zinc-50 disabled:opacity-50 transition active:scale-[0.97]"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-zinc-950" size={14} />
                <span>Saving Profile...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
