import { randomUUID } from "node:crypto";

const ALLOWED_CATEGORIES = new Set(["complaint", "bug", "suggestion", "praise", "query", "request"]);
const ALLOWED_SENTIMENTS = new Set(["positive", "negative", "neutral"]);
const ALLOWED_STATUS = new Set(["resolved", "pending"]);

export function normalizeCategory(value) {
  const v = String(value ?? "").toLowerCase().trim();
  return ALLOWED_CATEGORIES.has(v) ? v : "complaint";
}

export function normalizeSentiment(value) {
  const v = String(value ?? "").toLowerCase().trim();
  return ALLOWED_SENTIMENTS.has(v) ? v : "neutral";
}

function normalizeStatus(value, complexity) {
  const v = String(value ?? "").toLowerCase().trim();
  if (ALLOWED_STATUS.has(v)) return v;
  // Fallback if model returns something unexpected
  return complexity === "low" ? "resolved" : "pending";
}

function normalizeComplexity(value) {
  const c = String(value ?? "medium").toLowerCase().trim();
  if (c === "low" || c === "medium" || c === "high") return c;
  return "medium";
}

function priorityFromComplexity(complexity) {
  return complexity;
}

function teamAndAiAction(complexity) {
  if (complexity === "high") {
    return { team: "Supervisor", aiAction: "forwarded" };
  }
  if (complexity === "low") {
    return { team: "AI", aiAction: "resolved" };
  }
  // medium: not explicitly specified — keep with AI queue, treat as forwarded
  return { team: "AI", aiAction: "forwarded" };
}

/**
 * Maps getAIResponse() output → POST /api/triage response body.
 */
export function mapAIResultToTriage(ai, options = {}) {
  const customer = options.customer ?? "User";
  const complexity = normalizeComplexity(ai.complexity);
  const priority = priorityFromComplexity(complexity);
  const status = normalizeStatus(ai.status, complexity);
  const { team, aiAction } = teamAndAiAction(complexity);

  const id =
    options.id ??
    `${Date.now()}-${randomUUID().replace(/-/g, "").slice(0, 12)}`;

  return {
    id,
    customer,
    category: normalizeCategory(ai.category),
    sentiment: normalizeSentiment(ai.sentiment),
    priority,
    status,
    team,
    autoReply: String(ai.reply ?? ""),
    aiAction,
  };
}
