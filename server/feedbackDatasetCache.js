import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAIResponse } from "../ai/service.js";
import { mapAIResultToTriage } from "./triageMapper.js";
import { toFeedbacksApiRow } from "./feedbackApiShape.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "data", "feedback-samples.json");

/** @type {object[] | null} null until the one-shot warm finishes */
let cachedDatasetRows = null;
/** @type {Promise<void> | null} */
let datasetWarmPromise = null;

function normalizeSample(entry) {
  if (typeof entry === "string") {
    return { message: entry, customer: "User", id: undefined };
  }
  const message = String(entry?.message ?? "").trim();
  return {
    message,
    customer: String(entry?.customer ?? "User").trim() || "User",
    id: entry?.id != null ? String(entry.id) : undefined,
  };
}

function parseDatasetMessages(raw) {
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.messages;
  if (!Array.isArray(list)) {
    throw new Error("feedback-samples.json must contain a messages array");
  }
  return list.map(normalizeSample).filter((s) => s.message.length > 0);
}

/**
 * AI-processed rows from feedback-samples.json. `null` until {@link startFeedbackDatasetWarm} completes.
 */
export function getCachedDatasetRows() {
  return cachedDatasetRows;
}

/**
 * One-shot: read full dataset, run each message through getAIResponse, cache API rows in memory.
 * Safe to call multiple times; only the first call starts work.
 */
export function startFeedbackDatasetWarm() {
  if (datasetWarmPromise) {
    return datasetWarmPromise;
  }
  datasetWarmPromise = (async () => {
    try {
      const raw = await fs.readFile(DATA_PATH, "utf8");
      const samples = parseDatasetMessages(raw);
      const span = samples.length;
      const baseSortAt = Date.now() - span * 1000;
      const rows = [];
      for (let i = 0; i < samples.length; i++) {
        const { message, customer, id } = samples[i];
        const ai = await getAIResponse(message);
        const triage = mapAIResultToTriage(ai, { customer, id: id ?? `dataset-${i}` });
        const preview = message.length > 160 ? `${message.slice(0, 157)}...` : message;
        const sortAt = baseSortAt + i * 1000;
        const d = new Date(sortAt);
        const date = d.toISOString().slice(0, 10);
        const receivedAt = d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
        rows.push(
          toFeedbacksApiRow({
            ...triage,
            message,
            preview,
            sortAt,
            date,
            receivedAt,
            source: "Dataset",
            confidence: 88,
            autoReplyStatus: triage.autoReply ? "Draft" : "Not sent",
          }),
        );
      }
      cachedDatasetRows = rows;
      // eslint-disable-next-line no-console
      console.log(`[Dataset] Cached ${rows.length} AI-processed rows from ${DATA_PATH}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Dataset] Warm failed:", err?.message ?? err);
      cachedDatasetRows = [];
    }
  })();
  return datasetWarmPromise;
}

/** For tests / scripts that need to await the warm. */
export async function ensureFeedbackDatasetCache() {
  await startFeedbackDatasetWarm();
  return getCachedDatasetRows() ?? [];
}

export function clearFeedbackDatasetCache() {
  cachedDatasetRows = null;
  datasetWarmPromise = null;
}
