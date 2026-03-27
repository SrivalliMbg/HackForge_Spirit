import "dotenv/config";
import { createAIClient } from "./client.js";

const MODEL = "Qwen/Qwen2.5-7B-Instruct";

const FALLBACK = {
  category: "unknown",
  sentiment: "neutral",
  issue: "unknown",
  complexity: "medium",
  status: "pending",
  reply: "System is currently unavailable. Please try again later.",
  reason: "The system is currently unavailable to analyze this feedback.",
};

function extractFirstJsonObject(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth === 0) {
      const candidate = text.slice(start, i + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
  }
  return null;
}

function looksLikePlaceholder(text) {
  const value = String(text ?? "").trim();
  if (!value) return true;
  return /__[^ ]*__|_{2,}|<[^>]+>|\{[^}]*\}|placeholder|tbd|n\/a/i.test(value);
}

function normalizeResult(obj, originalMessage) {
  const out = { ...FALLBACK, ...(obj ?? {}) };
  // Hard rules
  const msgText = String(originalMessage ?? "").toLowerCase();
  const issueText = String(out.issue ?? "").toLowerCase();

  // Complexity enforcement (STRICT RULES)
  const isHighPaymentRefund = /payment|refund|debited|deducted|upi|card|chargeback/.test(msgText + " " + issueText);
  const isHighAccountSecurity =
    /(hacked|unauthori[sz]ed|fraud|scam|stolen|security|breach|suspicious|account takeover|otp.*(shared|leak)|someone else|unknown device)/.test(
      msgText,
    ) || /(hacked|unauthori[sz]ed|security|fraud)/.test(issueText);
  const isHighRepeatedOrCritical =
    /(again and again|third time|multiple times|keeps failing|still failing|failed again|every time|repeated|critical|urgent|blocked|can't access|cannot access|crash|crashing|data loss)/.test(
      msgText,
    ) || /(repeated|failed again|critical|crash)/.test(issueText);

  const isLowKnownSimple =
    /(forgot password|reset password|password reset|change password|how to login|how do i log in|login help|unable to find login|general feedback|just feedback|suggestion|feature request)/.test(
      msgText,
    ) || /(password reset|login help|suggestion|feedback)/.test(issueText);

  // Priority: force high > force low > keep model's medium/high/low.
  if (isHighPaymentRefund || isHighAccountSecurity || isHighRepeatedOrCritical) {
    out.complexity = "high";
  } else if (isLowKnownSimple) {
    out.complexity = "low";
  } else if (!out.complexity) {
    out.complexity = "medium";
  }

  if (String(out.complexity).toLowerCase() === "high") out.status = "pending";
  if (String(out.complexity).toLowerCase() === "low") out.status = "resolved";
  if (String(out.complexity).toLowerCase() === "medium") out.status = "pending";

  if (String(out.complexity).toLowerCase() === "high") {
    const existingReply = String(out.reply ?? "");
    const mentionsSupport =
      /support team|support|forwarded|escalat|raised a ticket|ticket/.test(existingReply.toLowerCase());
    if (!mentionsSupport) {
      out.reply =
        "Sorry about this—I've forwarded it to our support team and we’ll get back to you as soon as possible.";
    }
  }

  // Prevent placeholder-style replies and keep responses user-friendly.
  if (looksLikePlaceholder(out.reply)) {
    if (/password|login/.test(msgText + " " + issueText)) {
      out.reply = "Please click on the 'Forgot Password' option on the login page and follow the reset steps.";
    } else if (String(out.complexity).toLowerCase() === "high") {
      out.reply =
        "Thank you for reporting this issue. It has been forwarded to our support team for immediate assistance.";
    } else {
      out.reply = "Thank you for your feedback. We are reviewing your request and will assist you shortly.";
    }
  }

  // CATEGORY RULES: query vs request (request wins if both).
  const trimmed = msgText.trim();
  const isDirectQuestion =
    /\?\s*$/.test(trimmed) ||
    /^(how|what|why|where|when|who|which)\b/i.test(trimmed) ||
    /^(can i|could i|should i|do i|am i|is there|are there|does the|did you)\b/i.test(trimmed) ||
    /^(can you|could you|would you)\b/i.test(trimmed);
  const isActionRequest =
    /\b(please fix|please help|help me|kindly|reset my password|fix this|resolve this|escalate|file a ticket|process my|issue a refund|refund my)\b/i.test(
      msgText,
    ) ||
    /\b(please|help me|assist me)\b/i.test(msgText) ||
    /\b(can you|could you|would you)\b.*\b(fix|help|reset|refund|send|update|cancel|check|process)\b/i.test(msgText);

  if (isActionRequest && isDirectQuestion) {
    out.category = "request";
  } else if (isActionRequest) {
    out.category = "request";
  } else if (isDirectQuestion) {
    out.category = "query";
  }

  const allowedCategories = new Set(["complaint", "bug", "suggestion", "praise", "query", "request"]);
  if (!allowedCategories.has(String(out.category ?? "").toLowerCase())) {
    out.category = "complaint";
  }

  // Keep strictly the required keys as strings.
  return {
    category: String(out.category ?? ""),
    sentiment: String(out.sentiment ?? ""),
    issue: String(out.issue ?? ""),
    complexity: String(out.complexity ?? ""),
    status: String(out.status ?? ""),
    reply: String(out.reply ?? ""),
    reason: String(out.reason ?? ""),
  };
}

export async function getAIResponse(message) {
  try {
    if (!message || typeof message !== "string") {
      return normalizeResult({
        category: "unknown",
        sentiment: "neutral",
        issue: "unknown",
        complexity: "medium",
        status: "pending",
        reply: "System is currently unavailable. Please try again later.",
      }, message);
    }

    const client = createAIClient();

    const system = [
      "You are an autonomous AI system designed to analyze customer feedback and make decisions for an automated support dashboard.",
      "",
      "Analyze the given customer feedback and perform the following:",
      "",
      "1. Classify the feedback into one category:",
      "   complaint, bug, suggestion, praise, query, request",
      "   - complaint: user expresses dissatisfaction",
      "   - bug: something is broken or not working",
      "   - suggestion: proposing a feature or improvement",
      "   - praise: positive feedback",
      "   - query: user is asking a direct question",
      "   - request: user is asking the system to perform an action or help",
      "",
      "CATEGORY RULES:",
      "- If the message is a direct question → category must be \"query\"",
      "- If the user is asking the system to perform an action → category must be \"request\"",
      "- If both apply → use \"request\" (prioritize request over query)",
      "",
      "2. Determine sentiment:",
      "   positive, negative, neutral",
      "",
      "3. Extract the core issue in a short phrase (max 6 words)",
      "",
      "4. Decide complexity:",
      "   low → simple issue, can be resolved automatically",
      "   medium → requires some attention",
      "   high → cannot be resolved automatically and requires human intervention",
      "",
      "5. Decide status:",
      "   resolved → if complexity is low",
      "   pending → if complexity is medium or high",
      "",
      "6. Generate a short, professional reply (max 2 sentences):",
      "   - Acknowledge the feedback",
      "   - If complexity is high → clearly state it has been forwarded to the support team",
      "",
      "7. Provide a short reason (1 sentence) explaining your decision",
      "",
      "DECISION RULES:",
      "- Payment/refund → high",
      "- Security issues → high",
      "- Simple queries → low",
      "- Suggestions → low",
      "- Replies must be natural, complete, and user-friendly.",
      "- Do NOT use placeholders, blanks, or tokens like __A____, <...>, {....}, TBD, or N/A.",
      "- If giving instructions, provide clear generic steps. Example: Click on the 'Forgot Password' option on the login page.",
      "- Output MUST be valid JSON only",
      "- No extra text",
      "",
      "Return:",
      '{ "category": "", "sentiment": "", "issue": "", "complexity": "", "status": "", "reply": "", "reason": "" }',
    ].join("\n");

    const user = `Customer Feedback:\n\"${message}\"`;

    // eslint-disable-next-line no-console
    console.log("[AI Service] Sending chat.completions request:", {
      model: MODEL,
      hasMessage: Boolean(message),
    });

    const resp = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      max_tokens: 4096,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const text = resp?.choices?.[0]?.message?.content ?? "";
    const parsed = extractFirstJsonObject(text);
    return normalizeResult(parsed, message);
  } catch (err) {
    // Debug logging for API/connectivity failures.
    // eslint-disable-next-line no-console
    console.error("[AI Service] Request failed.");
    // eslint-disable-next-line no-console
    console.error("[AI Service] Message:", err?.message ?? err);
    // eslint-disable-next-line no-console
    console.error("[AI Service] Status:", err?.status ?? err?.response?.status ?? "unknown");
    if (err?.response?.data) {
      // eslint-disable-next-line no-console
      console.error("[AI Service] Response data:", err.response.data);
    }
    if (err?.error) {
      // eslint-disable-next-line no-console
      console.error("[AI Service] Error payload:", err.error);
    }
    if (err?.cause) {
      // eslint-disable-next-line no-console
      console.error("[AI Service] Cause:", err.cause);
    }
    return { ...FALLBACK };
  }
}

