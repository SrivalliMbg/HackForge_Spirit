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

const MIN_DATASET_ENTRIES = 100;

/** Ensure at least {@link MIN_DATASET_ENTRIES} rows by cycling shorter files (no slice cap on large files). */
function ensureMinDatasetEntries(samples) {
  if (samples.length === 0) {
    throw new Error("feedback-samples.json has no valid messages");
  }
  if (samples.length >= MIN_DATASET_ENTRIES) {
    return samples;
  }
  const base = samples;
  const out = [...base];
  let i = 0;
  while (out.length < MIN_DATASET_ENTRIES) {
    const s = base[i % base.length];
    out.push({
      message: `${s.message} [syn-${out.length + 1}]`,
      customer: s.customer,
      id: undefined,
    });
    i += 1;
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[Dataset] Padded dataset from ${base.length} to ${out.length} entries (minimum ${MIN_DATASET_ENTRIES})`,
  );
  return out;
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
      const parsed = parseDatasetMessages(raw);
      const dataset = ensureMinDatasetEntries(parsed);
      // eslint-disable-next-line no-console
      console.log("Dataset size:", dataset.length);

      const span = dataset.length;
      const baseSortAt = Date.now() - span * 1000;

      // Full dataset: map every row (no slice / limit). Uses Promise.all so all items are processed;
      // switch to a sequential loop here if your model provider rate-limits concurrent calls.
      const processed = await Promise.all(
        dataset.map(async (sample, i) => {
          const { message, customer, id } = sample;
          const ai = await getAIResponse(message);
          const triage = mapAIResultToTriage(ai, { customer, id: id ?? `dataset-${i}` });
          const preview = message.length > 160 ? `${message.slice(0, 157)}...` : message;
          const sortAt = baseSortAt + i * 1000;
          const d = new Date(sortAt);
          const date = d.toISOString().slice(0, 10);
          const receivedAt = d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
          return toFeedbacksApiRow({
            ...triage,
            message,
            preview,
            sortAt,
            date,
            receivedAt,
            source: "Dataset",
            confidence: 88,
            autoReplyStatus: triage.autoReply ? "Draft" : "Not sent",
          });
        }),
      );

      cachedDatasetRows = processed;
      // eslint-disable-next-line no-console
      console.log("Processed size:", processed.length);
      // eslint-disable-next-line no-console
      console.log(`[Dataset] Cached ${processed.length} AI-processed rows from ${DATA_PATH}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Dataset] Warm failed:", err?.message ?? err);
      cachedDatasetRows = [];
      // eslint-disable-next-line no-console
      console.log("Processed size:", 0);
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
