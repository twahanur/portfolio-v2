"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiX } from "react-icons/fi";
import { TbMessageChatbot, TbSparkles } from "react-icons/tb";

import { fetchAiContext } from "../lib/api";

const starterPrompts = [
  "Summarize Twaha's skills",
  "Which projects does he have?",
  "Start a project inquiry",
  "How can I contact Twaha?",
];

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I am Twaha's AI assistant. I can answer questions about his projects, skills, education, experience, and contact details. You can also start a project inquiry directly from here!",
  },
];

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function detectContactIntent(value) {
  return /\b(hire|hiring|available|availability|contact|message|email|whatsapp|project inquiry|work with|build my|need a developer|backend developer|full-stack developer|developer chai|hire korte|contact korte|kotha bolte|kaj korte|project niye|proposal|order|order korte|website banate|app banate|make a website|build a website|create a website)\b/i.test(
    value
  );
}

function isAffirmative(value) {
  return /^(yes|yeah|yep|sure|send|confirm|ok|okay|done|ha|haan|hmm|pathao|send koro|confirm koro)$/i.test(
    value.trim()
  );
}

function isNegative(value) {
  return /^(no|nope|cancel|stop|na|nah|bad dao|bad|skip|skip it)$/i.test(
    value.trim()
  );
}

function createLeadSummary(lead) {
  return [
    "Project inquiry for Twaha",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Project: ${lead.project}`,
    `Timeline / budget: ${lead.timeline || "Not specified"}`,
    "",
    "Source: AI Portfolio Assistant",
  ].join("\n");
}

export default function AiPortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactStep, setContactStep] = useState("idle"); // idle | name | email | project | timeline | confirm | sending | done
  const [lead, setLead] = useState({
    name: "",
    email: "",
    project: "",
    timeline: "",
  });
  const [profile, setProfile] = useState({
    name: "Twaha",
    fullName: "Twahanur Rahman",
    email: "twahanur@gmail.com",
  });
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const inputPlaceholder =
    contactStep === "idle" || contactStep === "done"
      ? "Ask about projects or start an inquiry..."
      : contactStep === "confirm"
        ? "Reply yes to send or no to cancel..."
        : "Share the requested detail...";

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-chat", handleOpen);
    return () => window.removeEventListener("open-chat", handleOpen);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const payload = await fetchAiContext();
        if (payload.success && payload.data?.profile) {
          const p = payload.data.profile;
          const shortName = p.name ? p.name.trim().split(" ")[0] : "Twaha";
          setProfile({
            name: shortName,
            fullName: p.name || "Twahanur Rahman",
            email: p.email || "twahanur@gmail.com",
          });
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `Hi, I am ${shortName}'s AI assistant. I can answer questions about projects, skills, education, experience, and contact details. You can also start a project inquiry directly from here!`,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch profile for AI assistant:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current?.focus();
  }, [messages, open]);

  async function sendMessage(content) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    if (contactStep !== "idle" && contactStep !== "done") {
      await handleContactFlow(trimmed);
      return;
    }

    if (detectContactIntent(trimmed)) {
      startContactFlow(trimmed);
      return;
    }

    const nextMessages = [...messages, createMessage("user", trimmed)];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.answer) {
        throw new Error(
          data.error ?? "The assistant could not answer right now."
        );
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.answer),
      ]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "The assistant could not answer right now.";
      setError(msg);
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "Sorry, I could not process that request. Please try again."
        ),
      ]);
    } finally {
      setLoading(false);
    }
  }

  function appendExchange(userContent, assistantContent) {
    setMessages((current) => [
      ...current,
      createMessage("user", userContent),
      createMessage("assistant", assistantContent),
    ]);
    setInput("");
    setError("");
  }

  function startContactFlow(initialRequest) {
    setContactStep("name");
    setLead({
      name: "",
      email: "",
      project: initialRequest,
      timeline: "",
    });
    appendExchange(
      initialRequest,
      `Great! I can send a focused project inquiry to ${profile.name} from here. First, what is your name?`
    );
  }

  async function handleContactFlow(value) {
    if (contactStep === "name") {
      setLead((current) => ({ ...current, name: value }));
      setContactStep("email");
      appendExchange(value, `Thanks! What email address can ${profile.name} reach you at?`);
      return;
    }

    if (contactStep === "email") {
      if (!isValidEmail(value)) {
        appendExchange(
          value,
          "That email does not look valid. Please enter a valid email address."
        );
        return;
      }

      setLead((current) => ({ ...current, email: value }));
      setContactStep("project");
      appendExchange(
        value,
        "Got it. Briefly describe the project, product, or features you want help with."
      );
      return;
    }

    if (contactStep === "project") {
      const updatedLead = { ...lead, project: value };
      setLead(updatedLead);
      setContactStep("timeline");
      appendExchange(
        value,
        "Thanks! Any timeline, budget range, or urgency? You can also say 'skip'."
      );
      return;
    }

    if (contactStep === "timeline") {
      const updatedLead = {
        ...lead,
        timeline: isNegative(value) ? "" : value,
      };
      setLead(updatedLead);
      setContactStep("confirm");
      appendExchange(
        value,
        `${createLeadSummary(updatedLead)}\n\nShould I submit this to ${profile.name}? Reply 'yes' to send or 'no' to cancel.`
      );
      return;
    }

    if (contactStep === "confirm") {
      if (isNegative(value)) {
        setContactStep("idle");
        appendExchange(
          value,
          `No problem. I've cancelled the inquiry. You can still email ${profile.name} at ${profile.email}.`
        );
        return;
      }

      if (!isAffirmative(value)) {
        appendExchange(value, "Please reply 'yes' to send it, or 'no' to cancel.");
        return;
      }

      await submitContactLead(value);
    }
  }

  async function submitContactLead(confirmText) {
    setMessages((current) => [...current, createMessage("user", confirmText)]);
    setInput("");
    setError("");
    setLoading(true);
    setContactStep("sending");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const payload = {
        name: lead.name,
        email: lead.email,
        subject: "AI Chat Inquiry",
        message: createLeadSummary(lead),
      };

      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to send the inquiry right now.");
      }

      setContactStep("done");
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `Done! I've saved your project inquiry to ${profile.name}'s database. He will get back to you shortly!`
        ),
      ]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to send the inquiry right now.";
      setError(msg);
      setContactStep("idle");
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `I could not send the inquiry from chat right now. You can email ${profile.name} directly at ${profile.email}.`
        ),
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
      {open ? (
        <section
          className="mb-3 flex h-[min(620px,calc(100vh-6.5rem))] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a24]/95 shadow-2xl shadow-black/80 backdrop-blur-xl sm:w-[400px]"
          aria-label="AI portfolio assistant"
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                <TbSparkles size={22} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">
                  AI Portfolio Assistant
                </h2>
                <p className="truncate text-xs text-gray-400">
                  Answers questions and books inquiries
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 cursor-pointer shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:border-white/20 hover:text-white"
              aria-label="Close AI assistant"
            >
              <FiX size={18} aria-hidden />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-white/10"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 bg-white/5 text-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-gray-400 animate-pulse">
                  Thinking...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/5 p-3 bg-black/20">
            {messages.length === 1 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => {
                  const displayPrompt = prompt
                    .replace("Twaha's", `${profile.name}'s`)
                    .replace("Twaha", profile.name);
                  return (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(displayPrompt)}
                      className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-left text-xs text-gray-300 transition hover:border-indigo-500/40 hover:text-indigo-300 cursor-pointer"
                    >
                      {displayPrompt}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {error ? (
              <p className="mb-2 text-xs text-red-400">{error}</p>
            ) : null}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={1000}
                placeholder={inputPlaceholder}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-[#0c0a24] transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-500"
                aria-label="Send message"
              >
                <FiSend size={18} aria-hidden />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group inline-flex h-14 w-14 items-center cursor-pointer justify-center rounded-2xl border border-indigo-400/30 bg-indigo-600 text-white shadow-xl shadow-indigo-950/40 transition hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-[#0c0a24]"
        aria-label={open ? "Hide AI portfolio assistant" : "Open AI portfolio assistant"}
      >
        <TbMessageChatbot
          size={28}
          aria-hidden
          className="transition group-hover:scale-105 animate-pulse"
        />
      </button>
    </div>
  );
}
