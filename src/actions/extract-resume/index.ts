'use server'

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in the environment variables.");
}

type StructuredResumeSections = {
  personalInformation: {
    name: string
    email: string
    phone: string
  }
  objective: string[]
  education: string[]
  projectsExperiences: string[]
  skills: string[]
  achievements: string[]
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
}

function normalizeSections(value: unknown): StructuredResumeSections {
  const v = (value && typeof value === "object" ? (value as Record<string, unknown>) : {}) as Record<string, unknown>
  const personal = (v.personalInformation && typeof v.personalInformation === "object"
    ? (v.personalInformation as Record<string, unknown>)
    : {}) as Record<string, unknown>

  return {
    personalInformation: {
      name: typeof personal.name === "string" ? personal.name : "",
      email: typeof personal.email === "string" ? personal.email : "",
      phone: typeof personal.phone === "string" ? personal.phone : "",
    },
    objective: ensureStringArray(v.objective),
    education: ensureStringArray(v.education),
    projectsExperiences: ensureStringArray(v.projectsExperiences),
    skills: ensureStringArray(v.skills),
    achievements: ensureStringArray(v.achievements),
  }
}

function tryParseJsonObject(text: string): unknown | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  // Direct JSON
  try {
    return JSON.parse(trimmed)
  } catch {
    // ignore
  }

  // JSON in fenced block
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim())
    } catch {
      // ignore
    }
  }

  // Best-effort: extract first {...} block
  const firstBrace = trimmed.indexOf("{")
  const lastBrace = trimmed.lastIndexOf("}")
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const slice = trimmed.slice(firstBrace, lastBrace + 1)
    try {
      return JSON.parse(slice)
    } catch {
      // ignore
    }
  }

  return null
}

// Helper function to call Groq API (OpenAI-compatible)
async function callGroqAPI(messages: Array<{ role: string; content: string }>, temperature: number = 0.7) {
  const apiKey = process.env.GROQ_API_KEY;
  const baseUrl = (process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  let response: Response
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
      }),
    });
  } catch (err) {
    const anyErr = err as any
    const causeCode = anyErr?.cause?.code as string | undefined
    if (causeCode === "ERR_SSL_TLSV1_UNRECOGNIZED_NAME") {
      throw new Error(
        `TLS handshake failed when calling Groq. This usually means GROQ_API_BASE_URL hostname does not match the server certificate (SNI). ` +
          `Please set GROQ_API_BASE_URL to the exact domain given by your Groq account. Current: ${baseUrl}`,
      )
    }
    throw err
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

export async function extractResumeWithGroq(resumeText: string) {
  try {
    if (!resumeText || resumeText.trim().length === 0) {
      return { success: false, error: "Resume text is required." };
    }

    const prompt = `You are an information extraction system.

Extract the resume into STRICT JSON ONLY (no markdown, no explanation, no code fences).

Return exactly this JSON shape (all keys required; arrays can be empty):
{
  "personalInformation": { "name": string, "email": string, "phone": string },
  "objective": string[],
  "education": string[],
  "projectsExperiences": string[],
  "skills": string[],
  "achievements": string[]
}

Rules:
- If a field is missing, use "" for strings and [] for arrays.
- Put each education / project / skill / achievement as a separate string item.

Resume text:
${resumeText}`;

    const content = await callGroqAPI([
      {
        role: 'user',
        content: prompt,
      },
    ], 0.5);

    if (!content) {
      return { success: false, error: "Failed to extract resume data." };
    }

    const parsed = tryParseJsonObject(content)
    if (!parsed) {
      return {
        success: false,
        error:
          "Groq returned a non-JSON response. Please verify GROQ_MODEL / GROQ_API_BASE_URL, then try again.",
      }
    }

    const normalized = normalizeSections(parsed)

    return {
      success: true,
      data: normalized,
    };
  } catch (error) {
    console.error("Error extracting resume with Groq API:", error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while extracting resume';
    return { success: false, error: errorMessage };
  }
}
