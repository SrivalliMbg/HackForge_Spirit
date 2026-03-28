import "dotenv/config";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { getAIResponse } from "./ai/service.js";
import { mapAIResultToTriage } from "./server/triageMapper.js";
import { buildFeedbackRecord } from "./server/buildFeedbackRecord.js";
import { toFeedbacksApiRow } from "./server/feedbackApiShape.js";
import { buildAnalyticsPayload } from "./server/analytics.js";
import { getCachedDatasetRows, startFeedbackDatasetWarm } from "./server/feedbackDatasetCache.js";
import { addFeedback, listFeedbacks } from "./server/feedbackStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "dist");

const app = express();

function resolvePort() {
  const raw = process.env.PORT;
  if (raw === undefined || raw === "") {
    return 3001;
  }
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1 || n > 65535) {
    return 3001;
  }
  return n;
}

const PORT = resolvePort();

function mergeFeedbacksSorted(liveApiRows, datasetRows) {
  const merged = [...liveApiRows, ...datasetRows];
  merged.sort((a, b) => (Number(b.sortAt) || 0) - (Number(a.sortAt) || 0));
  return merged;
}

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/feedbacks", (req, res) => {
  try {
    const dataset = getCachedDatasetRows() ?? [];
    const liveRows = listFeedbacks().map((record) => toFeedbacksApiRow(record));
    const merged = mergeFeedbacksSorted(liveRows, dataset);
    const previewRaw = req.query.preview;
    const wantPreview =
      previewRaw !== undefined && previewRaw !== null && String(previewRaw).trim() !== "";
    if (wantPreview) {
      // Dashboard only: newest N after sort — not a dataset row cap (full list below).
      const n = Math.max(1, Math.min(500, parseInt(String(previewRaw), 10) || 10));
      return res.json(merged.slice(0, n));
    }
    res.json(merged);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[API] GET /api/feedbacks failed:", err?.message ?? err);
    res.status(500).json({ error: "Failed to load feedbacks" });
  }
});

app.get("/api/analytics", (req, res) => {
  try {
    const live = listFeedbacks();
    const dataset = getCachedDatasetRows() ?? [];
    res.json(buildAnalyticsPayload(live, dataset));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[API] GET /api/analytics failed:", err?.message ?? err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

app.post("/api/triage", async (req, res) => {
  const message = req.body?.message;

  if (message === undefined || message === null) {
    return res.status(400).json({ error: "message is required" });
  }
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message must be a non-empty string" });
  }

  try {
    const ai = await getAIResponse(message.trim());
    const body = mapAIResultToTriage(ai);
    const record = buildFeedbackRecord(body, message.trim());
    addFeedback(record);
    return res.json(body);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[API] /api/triage failed:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to triage feedback" });
  }
});

app.use(express.static(DIST_DIR));

// SPA fallback (Express 5 / path-to-regexp: avoid app.get("*", ...) — wildcard parsing fails)
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const server = http.createServer(app);

server.listen(PORT, () => {
  startFeedbackDatasetWarm();
  // eslint-disable-next-line no-console
  console.log(`[API] Express server started — listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[API] GET /api/feedbacks | GET /api/analytics | POST /api/triage`);
  // eslint-disable-next-line no-console
  console.log(`[API] Frontend static path → ${DIST_DIR}`);
  // eslint-disable-next-line no-console
  console.log(`[API] Feedback dataset warming in background — merged API responses update when complete`);
});

server.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("[API] HTTP server error:", err?.message ?? err);
});
