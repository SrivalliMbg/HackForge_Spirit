/**
 * Aggregates sentiment and activity counts for the last 5 calendar days from feedback rows.
 * Uses the same in-memory data as GET /api/feedbacks (no AI calls).
 */

function last5DaysIso() {
  const out = [];
  const today = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function recordDayKey(record) {
  if (record.date && /^\d{4}-\d{2}-\d{2}/.test(String(record.date))) {
    return String(record.date).slice(0, 10);
  }
  const t = Date.parse(record.receivedAt ?? "");
  if (!Number.isNaN(t)) {
    return new Date(t).toISOString().slice(0, 10);
  }
  return null;
}

function sentimentKey(raw) {
  const s = String(raw ?? "").toLowerCase();
  if (s === "positive") return "positive";
  if (s === "negative") return "negative";
  return "neutral";
}

/**
 * @param {object[]} liveRecords - Full records from feedbackStore (buildFeedbackRecord shape)
 * @param {object[]} datasetRows - Cached dataset rows (same shape as GET /api/feedbacks)
 */
export function buildAnalyticsPayload(liveRecords, datasetRows) {
  const windowDays = last5DaysIso();
  const windowSet = new Set(windowDays);
  const fallbackDay = windowDays[windowDays.length - 1];

  const byDate = Object.fromEntries(
    windowDays.map((d) => [d, { positive: 0, neutral: 0, negative: 0 }]),
  );

  const records = [...liveRecords, ...datasetRows];

  for (const r of records) {
    let day = recordDayKey(r);
    if (!day) {
      day = fallbackDay;
    } else if (!windowSet.has(day)) {
      continue;
    }
    const sk = sentimentKey(r.sentiment);
    byDate[day][sk] += 1;
  }

  const sentimentTrends = windowDays.map((date) => ({
    date,
    positive: byDate[date].positive,
    neutral: byDate[date].neutral,
    negative: byDate[date].negative,
  }));

  const activityTimeline = windowDays.map((date) => ({
    date,
    count: byDate[date].positive + byDate[date].neutral + byDate[date].negative,
  }));

  return { sentimentTrends, activityTimeline };
}
