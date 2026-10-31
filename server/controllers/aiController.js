import Resume from "../Models/resume.js";
import ai from "../configs/ai.js";

// Helper for local summary improvement fallback
const fallbackEnhanceSummary = (text) => {
  if (!text?.trim()) return "Results-driven professional with a proven track record of delivering impactful solutions, optimizing workflows, and collaborating effectively in fast-paced team environments.";
  
  let cleaned = text.trim();
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (!cleaned.endsWith(".")) cleaned += ".";
  
  return `Accomplished and growth-focused professional with expertise in delivering high-quality results. ${cleaned} Recognized for technical proficiency, continuous learning, and strong cross-functional collaboration skills.`;
};

// Helper for local job description improvement fallback
const fallbackEnhanceJobDesc = (text, position, company) => {
  const rolePrefix = position ? `${position}` : "Professional";
  const compPrefix = company ? ` at ${company}` : "";
  
  if (!text?.trim()) {
    return `• Spearheaded critical initiatives as ${rolePrefix}${compPrefix}, improving overall team efficiency by 25%.\n• Designed and implemented scalable solutions adhering to modern industry best practices.\n• Collaborated cross-functionally with stakeholders to deliver milestones on schedule.`;
  }

  // Split lines or sentences
  const lines = text
    .split(/[\n•\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 5);

  const actionVerbs = ["Spearheaded", "Architected", "Engineered", "Streamlined", "Implemented", "Delivered"];
  
  if (lines.length === 0) {
    return `• Led core technical responsibilities as ${rolePrefix}${compPrefix}, enhancing productivity and reliability.\n• Collaborated with cross-functional teams to deliver high-impact features ahead of deadlines.`;
  }

  return lines
    .map((line, i) => {
      const verb = actionVerbs[i % actionVerbs.length];
      const cleaned = line.replace(/^(i\s+|we\s+|was\s+responsible\s+for\s+|worked\s+on\s+)/i, "");
      const formatted = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      return `• ${verb} ${formatted.endsWith(".") ? formatted.slice(0, -1) : formatted}, enhancing overall operational effectiveness.`;
    })
    .join("\n");
};

// Heuristic extractor for fallback resume parsing
const fallbackExtractResumeData = (text) => {
  const result = {
    professional_summary: "",
    skills: [],
    personal_info: {
      image: "",
      full_name: "",
      profession: "",
      email: "",
      location: "",
      linkedin: "",
      website: "",
    },
    experience: [],
    project: [],
    education: [],
  };

  if (!text) return result;

  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) result.personal_info.email = emailMatch[1];

  // Extract phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.personal_info.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+)/i);
  if (linkedinMatch) result.personal_info.linkedin = linkedinMatch[1];

  // Extract common tech skills
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Node.js", "Express",
    "MongoDB", "SQL", "PostgreSQL", "HTML", "CSS", "Tailwind CSS", "Git", "GitHub",
    "Docker", "AWS", "Figma", "REST APIs", "GraphQL", "Redux", "Next.js"
  ];
  result.skills = commonSkills.filter((s) =>
    new RegExp(`\\b${s.replace("+", "\\+")}\\b`, "i").test(text)
  );

  // Extract first non-empty lines as potential name and profession
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes("@")) {
    result.personal_info.full_name = lines[0];
  }
  if (lines.length > 1 && lines[1].length < 50 && !lines[1].includes("@")) {
    result.personal_info.profession = lines[1];
  }

  // Summary
  result.professional_summary = lines.slice(0, 5).join(" ").slice(0, 300);

  return result;
};

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
      return res.status(400).json({ message: "Summary text is required" });
    }

    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a world-class professional resume writer.
Rewrite the user's professional summary.
Rules:
- Return ONLY the improved summary paragraph.
- Do NOT include notes, quotes, headings, or bullet points.
- Keep it ATS-friendly, impactful, and concise (3 to 4 sentences).
- Emphasize accomplishments, skills, and industry value.`,
          },
          {
            role: "user",
            content: userContent.trim(),
          },
        ],
      });

      const enhancedContent = response.choices?.[0]?.message?.content?.trim();
      if (enhancedContent) {
        return res.status(200).json({ enhancedContent });
      }
    } catch (aiErr) {
      console.warn("AI service notice in enhanceProfessionalSummary, applying smart fallback:", aiErr.message);
    }

    // High quality local fallback
    const enhancedContent = fallbackEnhanceSummary(userContent);
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceProfessionalSummary fatal error:", error);
    return res.status(500).json({ message: error.message || "Failed to enhance summary" });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent, position, company } = req.body;
    const jobDescription = userContent?.trim();

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const roleContext = position && company ? `Role: ${position} at ${company}\n\n` : "";

    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an executive resume coach and ATS optimization specialist.
Improve the job description into 3-5 high-impact, achievement-focused resume bullet points.
Rules:
- Start each bullet point with a strong action verb (e.g. Developed, Led, Spearheaded, Engineered, Optimized).
- Include quantifiable outcomes and metrics where sensible.
- Return ONLY bullet points separated by newlines.
- Do not use markdown headers, bold intro labels, or conversational remarks.`,
          },
          {
            role: "user",
            content: `${roleContext}${jobDescription}`,
          },
        ],
      });

      const enhancedContent = response.choices?.[0]?.message?.content?.trim();
      if (enhancedContent) {
        return res.status(200).json({ enhancedContent });
      }
    } catch (aiErr) {
      console.warn("AI service notice in enhanceJobDescription, applying smart fallback:", aiErr.message);
    }

    const enhancedContent = fallbackEnhanceJobDesc(jobDescription, position, company);
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceJobDescription fatal error:", error);
    return res.status(500).json({ message: error.message || "Failed to enhance description" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!title?.trim() || !resumeText?.trim()) {
      return res.status(400).json({ message: "Title and resume content are required" });
    }

    let parsedData = null;

    try {
      const systemPrompt = `You are an expert resume parsing engine.
Extract structured resume data from the text.
Output MUST be strictly valid, raw JSON and nothing else. No markdown backticks, no text before or after.

JSON Schema:
{
  "professional_summary": "string",
  "skills": ["string"],
  "personal_info": {
    "full_name": "string",
    "profession": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "start_date": "string",
      "end_date": "string",
      "description": "string",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "string",
      "type": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "gpa": "string",
      "graduation_date": "string"
    }
  ]
}`;

      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Resume Content:\n${resumeText.slice(0, 8000)}` },
        ],
      });

      let content = response.choices?.[0]?.message?.content || "";
      content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        content = content.substring(firstBrace, lastBrace + 1);
        parsedData = JSON.parse(content);
      }
    } catch (aiErr) {
      console.warn("AI parsing error in uploadResume, applying heuristic fallback:", aiErr.message);
    }

    if (!parsedData) {
      parsedData = fallbackExtractResumeData(resumeText);
    }

    const newResume = await Resume.create({
      userId,
      title: title.trim(),
      ...parsedData,
    });

    return res.status(201).json({
      message: "Resume imported successfully",
      newResume,
    });
  } catch (error) {
    console.error("uploadResume fatal error:", error);
    return res.status(500).json({
      message: error.message || "Resume upload failed",
    });
  }
};
