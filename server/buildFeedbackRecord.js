/**
 * Builds a single record stored for GET /api/feedbacks from triage output + message.
 */
export function buildFeedbackRecord(triageBody, messageText) {
  const msg = String(messageText ?? "").trim();
  const sortAt = Date.now();
  return {
    ...triageBody,
    sortAt,
    message: msg,
    preview: msg.length > 160 ? `${msg.slice(0, 157)}...` : msg,
    source: "API",
    customerEmail: "",
    date: new Date().toISOString().slice(0, 10),
    receivedAt: new Date().toLocaleString(),
    confidence: 88,
    autoReplyStatus: triageBody.autoReply ? "Draft" : "Not sent",
  };
}
