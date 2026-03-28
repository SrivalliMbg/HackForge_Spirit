/**
 * Required fields for GET /api/feedbacks rows (plus optional message/preview for the UI).
 */
export function toFeedbacksApiRow(record) {
  const message = String(record.message ?? record.preview ?? "").trim();
  const preview =
    record.preview != null && String(record.preview).length
      ? String(record.preview)
      : message.length > 160
        ? `${message.slice(0, 157)}...`
        : message;

  const sortAtNum = Number(record.sortAt);
  const row = {
    id: String(record.id ?? ""),
    customer: String(record.customer ?? "User"),
    category: String(record.category ?? ""),
    sentiment: String(record.sentiment ?? ""),
    priority: String(record.priority ?? ""),
    status: String(record.status ?? ""),
    team: String(record.team ?? ""),
    autoReply: String(record.autoReply ?? ""),
    aiAction: String(record.aiAction ?? ""),
    ...(message ? { message, preview } : {}),
  };
  if (Number.isFinite(sortAtNum)) {
    row.sortAt = sortAtNum;
  }
  if (record.date != null && String(record.date)) {
    row.date = String(record.date);
  }
  if (record.receivedAt != null && String(record.receivedAt)) {
    row.receivedAt = String(record.receivedAt);
  }
  if (record.source != null && String(record.source)) {
    row.source = String(record.source);
  }
  if (record.customerEmail != null && String(record.customerEmail)) {
    row.customerEmail = String(record.customerEmail);
  }
  if (typeof record.confidence === "number" && Number.isFinite(record.confidence)) {
    row.confidence = record.confidence;
  }
  if (record.autoReplyStatus != null && String(record.autoReplyStatus)) {
    row.autoReplyStatus = String(record.autoReplyStatus);
  }
  return row;
}
