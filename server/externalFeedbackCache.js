import { getAIResponse } from "../ai/service.js";
import { mapAIResultToTriage } from "./triageMapper.js";
import { toFeedbacksApiRow } from "./feedbackApiShape.js";

/** @type {object[] | null} null until one-shot warm completes */
let cachedExternalRows = null;
/** @type {Promise<void> | null} */
let externalWarmPromise = null;

/**
 * Simulates a Bright Data–style web data feed (reviews, app-store snippets, forums).
 * Replace the body with a real HTTP call when API credentials are available.
 *
 * @returns {Promise<Array<{ message: string, source: 'external' }>>}
 */
export async function fetchExternalFeedback() {
  await new Promise((r) => setTimeout(r, 40));
  return [
    {
      message:
        "[Complaint] App crashes every time I upload a photo larger than 5MB on Android 14 — unusable for listings.",
      source: "external",
    },
    {
      message: "[Bug] Push notifications stop after the overnight background refresh until I force-quit and reopen.",
      source: "external",
    },
    {
      message: "[Query] Where can I download past invoices as PDF for tax season?",
      source: "external",
    },
    {
      message: "[Suggestion] Add a dark mode toggle in settings; the white screen is harsh at night.",
      source: "external",
    },
    {
      message: "[Praise] Love the new checkout flow — smooth, fast, and the order summary is crystal clear.",
      source: "external",
    },
    {
      message:
        "[Complaint] Charged twice for the same subscription renewal; support chat wait time was over 40 minutes.",
      source: "external",
    },
    {
      message: "[Bug] Search results flicker and reset to page 1 when I toggle a filter on the catalog.",
      source: "external",
    },
    {
      message: "[Query] Do you offer SAML SSO for teams under 25 seats on the Business plan?",
      source: "external",
    },
    {
      message: "[Suggestion] Let me export saved filters as a shareable link for my teammates.",
      source: "external",
    },
    {
      message: "[Praise] Your onboarding checklist actually helped our non-technical admin get set up in one day.",
      source: "external",
    },
    {
      message:
        "[Complaint] Delivery tracking shows “delivered” but the package never arrived — need a dispute path.",
      source: "external",
    },
    {
      message: "[Bug] CSV import fails silently when the header row has a BOM; no error message in the UI.",
      source: "external",
    },
    {
      message: "[Query] What is the data retention policy if we downgrade from Enterprise to Standard?",
      source: "external",
    },
  ];
}

/**
 * Cached, AI-enriched rows (same pipeline as the JSON dataset: getAIResponse → mapAIResultToTriage → toFeedbacksApiRow).
 */
export function getCachedExternalRows() {
  return cachedExternalRows;
}

/**
 * One-shot warm: fetch external stub messages, run each through the existing AI pipeline, cache results.
 * On any failure, caches an empty array so the API falls back to internal data only.
 */
export function startExternalFeedbackWarm() {
  if (externalWarmPromise) {
    return externalWarmPromise;
  }
  externalWarmPromise = (async () => {
    let items = [];
    try {
      items = await fetchExternalFeedback();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[External] fetchExternalFeedback failed:", err?.message ?? err);
      cachedExternalRows = [];
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      cachedExternalRows = [];
      // eslint-disable-next-line no-console
      console.log("[External] No external items; using internal dataset only.");
      return;
    }

    const span = items.length;
    const baseSortAt = Date.now() - span * 1000 - 400_000;

    try {
      const processed = await Promise.all(
        items.map(async (item, i) => {
          const message = String(item?.message ?? "").trim();
          if (!message) {
            return null;
          }
          const ai = await getAIResponse(message);
          const triage = mapAIResultToTriage(ai, { customer: "User", id: `external-${i}` });
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
            source: "external",
            confidence: 88,
            autoReplyStatus: triage.autoReply ? "Draft" : "Not sent",
          });
        }),
      );

      cachedExternalRows = processed.filter(Boolean);
      // eslint-disable-next-line no-console
      console.log("[External] Cached", cachedExternalRows.length, "Bright Data–style rows (AI-processed once)");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[External] Warm failed:", err?.message ?? err);
      cachedExternalRows = [];
    }
  })();
  return externalWarmPromise;
}

export function clearExternalFeedbackCache() {
  cachedExternalRows = null;
  externalWarmPromise = null;
}
