import Resume from "../Models/resume.js";
import ai from "../configs/ai.js";

const fallbackEnhanceSummary = (text) => {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const normalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return normalized.endsWith(".") ? normalized : `${normalized}.`;
};

const fallbackEnhanceJobDesc = (text) => {
  const lines = text.split(/[\n•\r]+/).map((line) => line.trim()).filter((line) => line.length > 5);
  if (!lines.length) return text.trim();
  const actionVerbs = ["Delivered", "Developed", "Implemented", "Collaborated on", "Improved", "Supported"];
  return lines.map((line, index) => {
    const cleaned = line.replace(/^(i\s+|we\s+|was\s+responsible\s+for\s+|worked\s+on\s+)/i, "");
    const formatted = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `• ${actionVerbs[index % actionVerbs.length]} ${formatted}`;
  }).join("\n");
};

const fallbackExtractResumeData = (text) => {
  const result = {
    professional_summary: "",
    skills: [],
    personal_info: { image: "", full_name: "", profession: "", email: "", phone: "", location: "", linkedin: "", website: "" },
    experience: [],
    project: [],
    education: [],
  };
  if (typeof text !== "string" || !text.trim()) return result;

  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) result.personal_info.email = emailMatch[1];
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  if (phoneMatch) result.personal_info.phone = phoneMatch[0];
  const linkedinMatch = text.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+)/i);
  if (linkedinMatch) result.personal_info.linkedin = linkedinMatch[1];

  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Node.js", "Express",
    "MongoDB", "SQL", "PostgreSQL", "HTML", "CSS", "Tailwind CSS", "Git", "GitHub",
    "Docker", "AWS", "Figma", "REST APIs", "GraphQL", "Redux", "Next.js"
  ];
  result.skills = commonSkills.filter((skill) => {
    const escaped = skill.replace(/[.*+?^\u0024{}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  });

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines[0] && lines[0].length < 80 && !lines[0].includes("@")) result.personal_info.full_name = lines[0];
  if (lines[1] && lines[1].length < 100 && !lines[1].includes("@")) result.personal_info.profession = lines[1];
  result.professional_summary = lines.slice(0, 5).join(" ").slice(0, 1000);
  return result;
};

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body ?? {};
    if (typeof userContent !== "string" || !userContent.trim()) {
      return res.status(400).json({ message: "Summary text is required" });
    }
    if (userContent.length > 5000) {
      return res.status(413).json({ message: "Summary text must be 5,000 characters or fewer." });
    }

    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional resume writer. Rewrite the user's summary using only facts supplied by the user. Never invent employers, skills, responsibilities, numbers, or achievements. Return only one concise ATS-friendly paragraph of 3-4 sentences.`,
          },
          { role: "user", content: userContent.trim() },
        ],
      });
      const enhancedContent = response.choices?.[0]?.message?.content?.trim();
      if (enhancedContent) return res.status(200).json({ enhancedContent });
    } catch (aiErr) {
      console.warn("AI service unavailable for summary; using local fallback:", aiErr.message);
    }

    return res.status(200).json({ enhancedContent: fallbackEnhanceSummary(userContent) });
  } catch (error) {
    console.error("enhanceProfessionalSummary error:", error);
    return res.status(500).json({ message: "Failed to enhance summary" });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent, position, company } = req.body ?? {};
    if (typeof userContent !== "string" || !userContent.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }
    if (userContent.length > 8000) {
      return res.status(413).json({ message: "Job description must be 8,000 characters or fewer." });
    }

    const roleContext = [position, company].filter((value) => typeof value === "string" && value.trim()).join(" at ");
    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an executive resume coach. Rewrite the supplied responsibilities into 3-5 concise, achievement-focused bullets. Preserve facts exactly. Do not invent metrics, percentages, outcomes, or tools. Return only bullets.`,
          },
          { role: "user", content: `${roleContext ? `Role context: ${roleContext}\n\n` : ""}${userContent.trim()}` },
        ],
      });
      const enhancedContent = response.choices?.[0]?.message?.content?.trim();
      if (enhancedContent) return res.status(200).json({ enhancedContent });
    } catch (aiErr) {
      console.warn("AI service unavailable for job description; using local fallback:", aiErr.message);
    }

    return res.status(200).json({ enhancedContent: fallbackEnhanceJobDesc(userContent) });
  } catch (error) {
    console.error("enhanceJobDescription error:", error);
    return res.status(500).json({ message: "Failed to enhance job description" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body ?? {};
    if (typeof title !== "string" || !title.trim() || typeof resumeText !== "string" || !resumeText.trim()) {
      return res.status(400).json({ message: "Title and resume content are required" });
    }
    if (resumeText.length > 30000) {
      return res.status(413).json({ message: "Extracted resume text must be 30,000 characters or fewer." });
    }

    let parsedData = null;
    try {
      const systemPrompt = `You are a resume parsing engine. Extract only facts present in the supplied resume text. Return strictly valid JSON with this shape:
{
  "professional_summary": "string",
  "skills": ["string"],
  "personal_info": {
    "full_name": "string", "profession": "string", "email": "string",
    "phone": "string", "location": "string", "linkedin": "string", "website": "string"
  },
  "experience": [{
    "company": "string", "position": "string", "start_date": "string",
    "end_date": "string", "description": "string", "is_current": false
  }],
  "project": [{"name": "string", "type": "string", "description": "string"}],
  "education": [{
    "institution": "string", "degree": "string", "field": "string",
    "gpa": "string", "graduation_date": "string"
  }]
}`;

      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Resume Content:\n${resumeText.slice(0, 12000)}` },
        ],
      });
      let content = response.choices?.[0]?.message?.content || "";
      content = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        parsedData = JSON.parse(content.slice(firstBrace, lastBrace + 1));
      }
    } catch (aiErr) {
      console.warn("AI resume parsing unavailable; using heuristic fallback:", aiErr.message);
    }

    if (!parsedData || typeof parsedData !== "object" || Array.isArray(parsedData)) {
      parsedData = fallbackExtractResumeData(resumeText);
    }

    const safeData = {
      professional_summary: typeof parsedData.professional_summary === "string" ? parsedData.professional_summary.slice(0, 5000) : "",
      skills: Array.isArray(parsedData.skills) ? parsedData.skills.filter((item) => typeof item === "string").slice(0, 100) : [],
      personal_info: {
        full_name: parsedData.personal_info?.full_name || "",
        profession: parsedData.personal_info?.profession || "",
        email: parsedData.personal_info?.email || "",
        phone: parsedData.personal_info?.phone || "",
        location: parsedData.personal_info?.location || "",
        linkedin: parsedData.personal_info?.linkedin || "",
        website: parsedData.personal_info?.website || "",
      },
      experience: Array.isArray(parsedData.experience) ? parsedData.experience.slice(0, 30) : [],
      project: Array.isArray(parsedData.project) ? parsedData.project.slice(0, 30) : [],
      education: Array.isArray(parsedData.education) ? parsedData.education.slice(0, 30) : [],
    };

    const newResume = await Resume.create({
      userId: req.userId,
      title: title.trim().slice(0, 120),
      ...safeData,
    });

    return res.status(201).json({ message: "Resume imported successfully", newResume });
  } catch (error) {
    console.error("uploadResume error:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Resume upload failed" });
  }
};
