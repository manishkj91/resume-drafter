import { Router, type IRouter } from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  ParseResumeResponse,
  AnalyzeResumeResponse,
  GetTemplatesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

function parseResumeText(rawText: string) {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  const contact = {
    name: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    location: null as string | null,
    linkedin: null as string | null,
    website: null as string | null,
  };

  const emailMatch = rawText.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  const phoneMatch = rawText.match(/(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) contact.phone = phoneMatch[0].trim();

  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) contact.linkedin = `https://${linkedinMatch[0]}`;

  const websiteMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?((?!linkedin)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[\w-]*)?)/);
  if (websiteMatch && !websiteMatch[0].includes("linkedin")) {
    contact.website = websiteMatch[0].startsWith("http") ? websiteMatch[0] : `https://${websiteMatch[0]}`;
  }

  if (lines.length > 0) {
    const firstLine = lines[0];
    if (!firstLine.includes("@") && !firstLine.match(/\d{3}/) && firstLine.length < 60) {
      contact.name = firstLine;
    }
  }

  const locationPatterns = [
    /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/,
    /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/,
  ];
  for (const pat of locationPatterns) {
    const m = rawText.match(pat);
    if (m) { contact.location = m[1]; break; }
  }

  const sectionHeaders = {
    summary: /^(summary|professional\s+summary|objective|profile|about)/i,
    experience: /^(experience|work\s+experience|employment|professional\s+experience|work\s+history)/i,
    education: /^(education|academic|academic\s+background)/i,
    skills: /^(skills|technical\s+skills|core\s+competencies|competencies|technologies)/i,
    certifications: /^(certifications?|licenses?|credentials?|professional\s+development)/i,
  };

  const sections: Record<string, number> = {};
  lines.forEach((line, idx) => {
    for (const [key, pat] of Object.entries(sectionHeaders)) {
      if (pat.test(line) && line.length < 50) {
        sections[key] = idx;
      }
    }
  });

  const sectionOrder = Object.entries(sections).sort((a, b) => a[1] - b[1]);

  function getSectionLines(sectionName: string): string[] {
    const idx = sections[sectionName];
    if (idx === undefined) return [];
    const nextSection = sectionOrder.find(([, i]) => i > idx)?.[1] ?? lines.length;
    return lines.slice(idx + 1, nextSection);
  }

  let summary: string | null = null;
  const summaryLines = getSectionLines("summary");
  if (summaryLines.length > 0) {
    summary = summaryLines.join(" ").trim() || null;
  }

  const workExperience: Array<{
    company: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    location: string | null;
    bullets: string[];
  }> = [];
  const expLines = getSectionLines("experience");
  let currentJob: typeof workExperience[0] | null = null;
  const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|(?:\d{1,2}\/\d{4})|\d{4}/i;

  for (const line of expLines) {
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.startsWith("·")) {
      if (currentJob) currentJob.bullets.push(line.replace(/^[•\-*·]\s*/, "").trim());
    } else if (datePattern.test(line) || (line.length < 80 && /[A-Z]/.test(line[0]))) {
      if (currentJob) workExperience.push(currentJob);
      const dateMatch = line.match(/(.+?)\s*(?:[-–|]\s*(.+?))?\s*(?:•|\|)?\s*(\d{4}.*)?$/);
      const title = dateMatch?.[1]?.trim() ?? line;
      const dateStr = line.match(/(\w+ \d{4})\s*[-–]\s*(\w+ \d{4}|present|current)/i);
      currentJob = {
        company: "",
        title,
        startDate: dateStr?.[1] ?? null,
        endDate: dateStr?.[2] ?? null,
        location: null,
        bullets: [],
      };
    } else if (currentJob && !currentJob.company && line.length < 80) {
      currentJob.company = line;
    } else if (currentJob) {
      currentJob.bullets.push(line);
    }
  }
  if (currentJob) workExperience.push(currentJob);

  const education: Array<{
    institution: string;
    degree: string | null;
    field: string | null;
    graduationDate: string | null;
    gpa: string | null;
  }> = [];
  const eduLines = getSectionLines("education");
  let currentEdu: typeof education[0] | null = null;
  for (const line of eduLines) {
    const gpaMatch = line.match(/GPA[:\s]+([\d.]+)/i);
    const gradYear = line.match(/(\d{4})/);
    const degreeKeywords = /bachelor|master|ph\.?d|associate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|mba|bs|ms|ba|ma/i;

    if (degreeKeywords.test(line)) {
      if (currentEdu) education.push(currentEdu);
      currentEdu = {
        institution: "",
        degree: line,
        field: null,
        graduationDate: gradYear?.[1] ?? null,
        gpa: gpaMatch?.[1] ?? null,
      };
    } else if (currentEdu && !currentEdu.institution) {
      currentEdu.institution = line;
    } else if (!currentEdu && line.length < 80) {
      currentEdu = {
        institution: line,
        degree: null,
        field: null,
        graduationDate: gradYear?.[1] ?? null,
        gpa: gpaMatch?.[1] ?? null,
      };
    }
  }
  if (currentEdu) education.push(currentEdu);

  const skills: string[] = [];
  const skillLines = getSectionLines("skills");
  for (const line of skillLines) {
    const parts = line.split(/[,|•·\/]/).map((s) => s.trim()).filter(Boolean);
    skills.push(...parts);
  }

  const certifications: string[] = [];
  const certLines = getSectionLines("certifications");
  certifications.push(...certLines.filter((l) => l.length < 100));

  return {
    contact,
    summary,
    workExperience: workExperience.slice(0, 10),
    education: education.slice(0, 5),
    skills: skills.slice(0, 30),
    certifications: certifications.slice(0, 10),
    rawText,
  };
}

router.post("/resume/parse", upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ error: "Could not extract text from PDF. The file may be image-based or corrupt." });
      return;
    }

    const parsed = parseResumeText(rawText);
    res.json(ParseResumeResponse.parse(parsed));
  } catch (err) {
    req.log.error({ err }, "Failed to parse PDF");
    res.status(400).json({ error: "Failed to parse PDF file" });
  }
});

router.post("/resume/analyze", async (req, res): Promise<void> => {
  const body = req.body as { resume?: unknown };
  if (!body.resume) {
    res.status(400).json({ error: "Missing resume data" });
    return;
  }

  try {
    const resumeJson = JSON.stringify(body.resume, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. 
Analyze the provided resume JSON and return a detailed analysis as a JSON object with this exact structure:
{
  "atsScore": <integer 0-100>,
  "atsSummary": "<brief 1-2 sentence summary of ATS compliance>",
  "atsIssues": [
    { "severity": "<error|warning|info>", "section": "<section name>", "message": "<specific issue>" }
  ],
  "sectionSuggestions": [
    { "section": "<section name>", "suggestions": ["<specific actionable suggestion>", ...] }
  ],
  "overallSuggestions": ["<overall suggestion>", ...],
  "strengths": ["<strength>", ...]
}

ATS scoring criteria:
- Contact info completeness (email, phone, location required)
- Standard section headings (Experience, Education, Skills)
- No graphics, tables, or columns that ATS can't read
- Measurable achievements with numbers and metrics
- Strong action verbs starting bullet points
- Relevant keywords for industry
- Proper formatting (consistent dates, no special characters)
- Quantified impact statements
- Summary/objective section
- Skills section with relevant keywords

Return ONLY the JSON object, no markdown, no extra text.`,
        },
        {
          role: "user",
          content: `Analyze this resume:\n\n${resumeJson}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
    const analysisData = JSON.parse(cleanedContent);

    const validated = AnalyzeResumeResponse.parse({
      atsScore: analysisData.atsScore ?? 50,
      atsSummary: analysisData.atsSummary ?? "Analysis complete.",
      atsIssues: analysisData.atsIssues ?? [],
      sectionSuggestions: analysisData.sectionSuggestions ?? [],
      overallSuggestions: analysisData.overallSuggestions ?? [],
      strengths: analysisData.strengths ?? [],
    });

    res.json(validated);
  } catch (err) {
    req.log.error({ err }, "Failed to analyze resume");
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

router.get("/resume/templates", async (_req, res): Promise<void> => {
  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Traditional single-column layout with clean serif-inspired typography. Timeless and professional.",
      previewColor: "#1a365d",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with a bold accent bar and strong section headers. Great for tech roles.",
      previewColor: "#2d3748",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Ultra-clean layout with generous whitespace and thin dividers. Elegant simplicity.",
      previewColor: "#4a5568",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Bold typography with a dark header accent and structured layout. Ideal for senior roles.",
      previewColor: "#553c9a",
    },
  ];

  res.json(GetTemplatesResponse.parse(templates));
});

export default router;
