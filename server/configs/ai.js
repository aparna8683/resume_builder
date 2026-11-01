
import OpenAI from "openai";

const usingGemini =
  Boolean(process.env.GEMINI_API_KEY) && !process.env.OPENAI_API_KEY;

const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

const baseURL =
  process.env.OPENAI_BASE_URL ||
  (usingGemini
    ? "https://generativelanguage.googleapis.com/v1beta/openai/"
    : undefined);

const ai = apiKey
  ? new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    })
  : {
      chat: {
        completions: {
          create: async () => {
            throw new Error(
              "AI provider is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY."
            );
          },
        },
      },
    };

export default ai;
