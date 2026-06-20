import { NextResponse } from "next/server";

const MAX_MESSAGES = 10;
const MAX_CONTENT_LENGTH = 1000;
const DEFAULT_TIMEOUT_MS = 45000;

function getLanguageInstruction(message) {
  if (/[\u0980-\u09FF]/.test(message)) {
    return "The visitor's latest message uses Bangla script. Answer in Bangla script.";
  }

  const banglishPattern =
    /\b(ami|amake|amar|apni|apnar|tumi|tomar|ki|kivabe|kemne|kemon|konta|kon|kono|ase|ache|nai|parbe|pari|korbo|korte|koro|kaj|gula|gulo|bolo|dao|chai|hire|resume|koi)\b/i;

  if (banglishPattern.test(message)) {
    return "The visitor's latest message is Banglish or Romanized Bengali. Answer in natural Banglish, not full English.";
  }

  return "The visitor's latest message is English. Answer in English, not Banglish.";
}

function formatDynamicContext(data) {
  const profile = data.profile || {};
  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const skillsList = data.skills || [];
  const certificates = data.certificates || [];
  const resumeUrl = data.resumeUrl || "";

  const skillsGrouped = skillsList.map((s) => s.name);

  const finalLocation = profile.location || "Bangladesh";
  const finalEmail = profile.email || "twahanur@gmail.com";
  const finalPhone = profile.phone || "";
  const finalPhoneHref = profile.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}` : "";
  const finalGithub = profile.github || "https://github.com/Twahanur";
  const finalLinkedin = profile.linkedin || "https://linkedin.com/in/twahanur";

  const socialsText = [
    `- GitHub: ${finalGithub}`,
    `- LinkedIn: ${finalLinkedin}`,
    profile.twitter && `- Twitter: ${profile.twitter}`,
    profile.facebook && `- Facebook: ${profile.facebook}`,
    profile.instagram && `- Instagram: ${profile.instagram}`,
    profile.youtube && `- YouTube: ${profile.youtube}`,
  ].filter(Boolean).join("\n");

  return `
Identity:
- Name: ${profile.name || "Twahanur Rahman"}.
- Location: ${finalLocation}.
- Role: ${profile.title || "Full-stack Web Developer"}.
- Bio: ${profile.bio || ""}.
- Homepage Short Bio: ${profile.shortBio || ""}.
- Email: ${finalEmail}.
- Phone / WhatsApp: ${finalPhone} (${finalPhoneHref}).
${socialsText}
- Resume path: ${resumeUrl}.

Skills:
${skillsGrouped.map((skill) => `- ${skill}`).join("\n")}

Projects:
${projects
  .map(
    (project) => `- ${project.title}: ${project.tagline}
  Overview: ${project.description}
  Tech: ${project.tags?.map(t => typeof t === "object" && t.tag ? t.tag.name : t).join(", ") || project.features?.join(", ") || ""}.
  Problem: ${project.problem || ""}
  Architecture: ${project.architecture || ""}
  Metrics: ${project.metrics?.join("; ") || ""}
  Live: ${project.live}
  Code: ${project.code}`,
  )
  .join("\n\n")}

Work experience:
${experiences
  .map(
    (role) => `- ${role.role} at ${role.company} (${role.employmentType}, ${role.period}): ${role.tagline}
  Summary: ${role.summary}
  Highlights: ${role.highlights?.join("; ") || ""}
  Tech: ${role.techStack?.join(", ") || ""}.`,
  )
  .join("\n\n")}

Certifications and learning:
${certificates
  .map(
    (c) => `- ${c.name} issued by ${c.issuer} (${c.issueDate || "N/A"})`
  )
  .join("\n")}
`;
}

async function fetchPortfolioContext() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${apiUrl}/api/ai-context`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch AI context: ${res.statusText}`);
    }
    const payload = await res.json();
    if (payload.success && payload.data) {
      const profile = payload.data.profile || {};
      const name = profile.name || "Twahanur Rahman";
      const shortName = name.split(" ")[0] || "Twaha";
      const email = profile.email || "twahanur.rahman@gmail.com";
      const contextText = formatDynamicContext(payload.data);
      return { contextText, name, shortName, email };
    }
    throw new Error("Payload success flag is false");
  } catch (error) {
    console.error("Error fetching dynamic portfolio context, falling back to basic prompt:", error);
    const defaultContext = `
Identity:
- Name: Twahanur Rahman (Twaha).
- Location: Bangladesh.
- Role: Full-stack Web Developer.
- Email: twahanur.rahman@gmail.com.
- GitHub: https://github.com/Twahanur.
- LinkedIn: https://linkedin.com/in/twahanur.
`;
    return {
      contextText: defaultContext,
      name: "Twahanur Rahman",
      shortName: "Twaha",
      email: "twahanur.rahman@gmail.com"
    };
  }
}

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const rawMessages = body.messages || [];

    // Filter and normalize messages
    const messages = rawMessages
      .slice(-MAX_MESSAGES)
      .map((msg) => {
        if (!msg || typeof msg !== "object") return null;
        const role = msg.role === "assistant" ? "model" : "user";
        const content = String(msg.content ?? "").trim().slice(0, MAX_CONTENT_LENGTH);
        if (!content) return null;
        return { role, parts: [{ text: content }] };
      })
      .filter(Boolean);

    if (!messages.length || messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json(
        { error: "Please send a valid message to the assistant." },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1].parts[0].text;
    const languageInstruction = getLanguageInstruction(latestUserMessage);
    const { contextText, name, shortName, email } = await fetchPortfolioContext();

    const systemPrompt = `You are ${name}'s (${shortName}) portfolio assistant. Answer visitors using only the portfolio context below.

Rules:
- Be concise, friendly, and specific. Keep answers under 3-4 sentences unless comparison or list is needed.
- ${languageInstruction}
- Match the visitor's language style. If they write English, answer in English. If they write Bangla script, answer in Bangla. If they write Banglish or Romanized Bengali, answer in natural Banglish.
- For Banglish, keep common technical terms in English and use simple conversational wording. Examples: "${shortName} er react skill high", "uni Next.js, Node.js, and Tailwind CSS niye kaj kore", "contact korte chaile profile page check korte paren or directly hire option click koro".
- Understand common Banglish words and phrases such as "ki", "kono", "ase/ache", "parbe", "kaj", "project gula", "experience kemon", "hire korte chai", "contact korbo kivabe", "resume koi".
- If the answer is not in the portfolio context, say you do not have that detail and suggest contacting ${shortName}.
- Do not invent years of experience, employers, degrees, pricing, or technologies not listed.
- For hiring/contact questions, share the email (${email}), WhatsApp link, LinkedIn, GitHub, or resume path when useful.

Portfolio context:
${contextText}`;

    // Query Gemini Flash Lite Latest
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: messages,
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 600,
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    const answer = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI assistant API error:", error);
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The assistant took too long to respond. Please try again."
        : "Unable to reach the AI assistant right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
