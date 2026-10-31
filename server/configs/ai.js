import OpenAI from "openai";

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || undefined;

const ai = apiKey
  ? new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) })
  : {
      chat: {
        completions: {
          create: async () => {
            throw new Error("AI provider is not configured. Set GEMINI_API_KEY (and OPENAI_BASE_URL when required).");
          },
        },
      },
    };

export default ai;
