"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Video,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingSchedulerModal({
  isOpen,
  onClose,
}: MeetingSchedulerModalProps) {
  const [duration, setDuration] = useState<"15" | "30" | "45">("30");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const timeSlots = ["10:00 AM", "02:30 PM", "06:00 PM", "08:30 PM", "10:00 PM"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: "Missing Selection",
        text: "Please select a date and preferred time slot.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send submission request to FormSubmit / API
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append(
        "message",
        `[Meeting Request] Duration: ${duration} mins | Date: ${selectedDate} | Time: ${selectedTime} | Topic: ${topic || "1-on-1 Call"}`
      );
      formData.append("_subject", `1-on-1 Call Request: ${name} (${duration}m)`);

      await fetch("https://formsubmit.co/ajax/405d8dc9b6485be63ea3015bd6dace05", {
        method: "POST",
        body: formData,
      });

      Swal.fire({
        title: "Call Scheduled!",
        text: `Your ${duration}-minute meeting request for ${selectedDate} at ${selectedTime} has been sent. You will receive a Google Meet invite shortly!`,
        icon: "success",
        confirmButtonColor: "#6366f1",
      });

      onClose();
    } catch {
      Swal.fire({
        title: "Submission Error",
        text: "Could not send schedule request automatically. Please try again or reach out on WhatsApp.",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0e0f17] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#6366f1]/10 text-[#6366f1]">
                <Video className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-white">Schedule 1-on-1 Call</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Book a Google Meet call for job offers, freelance projects, or tech consultations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duration Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#6366f1]" /> Select Call Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "15", label: "15 Mins", desc: "Quick Intro" },
              { id: "30", label: "30 Mins", desc: "Tech / Offer Chat" },
              { id: "45", label: "45 Mins", desc: "Deep Dive" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDuration(item.id as "15" | "30" | "45")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  duration === item.id
                    ? "bg-[#6366f1]/15 border-[#6366f1] text-white font-bold shadow-lg shadow-[#6366f1]/20"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time Selection */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#6366f1]" /> Preferred Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Time Slot
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#6366f1]"
              >
                <option value="" disabled className="bg-zinc-900 text-slate-400">
                  Select Time Slot
                </option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} className="bg-zinc-900 text-white">
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Your Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <input
              type="text"
              placeholder="Meeting Topic (e.g. Fullstack Job Interview / Project Quote)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold text-sm shadow-lg shadow-[#6366f1]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? "Sending Request..." : "Confirm & Send Calendar Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
