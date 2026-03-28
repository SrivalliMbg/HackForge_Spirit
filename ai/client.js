import "dotenv/config";
import OpenAI from "openai";

function cleanEnv(value) {
  return String(value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

function maskKey(apiKey) {
  if (!apiKey) return "missing";
  return `${apiKey.slice(0, 5)}...`;
}

export function createAIClient() {
  const baseURL = cleanEnv(process.env.AI_BASE_URL);
  const apiKey = cleanEnv(process.env.AI_API_KEY);

  // Debug logs to verify .env loading and client config source.
  // eslint-disable-next-line no-console
  console.log("[AI Client] Base URL:", baseURL || "missing");
  // eslint-disable-next-line no-console
  console.log("[AI Client] API key prefix:", maskKey(apiKey));

  if (!baseURL) {
    throw new Error("Missing AI_BASE_URL. Ensure .env is loaded and AI_BASE_URL is set.");
  }
  if (!apiKey) {
    throw new Error("Missing AI_API_KEY. Ensure .env is loaded and AI_API_KEY is set.");
  }

  return new OpenAI({
    baseURL,
    apiKey,
    defaultHeaders: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

