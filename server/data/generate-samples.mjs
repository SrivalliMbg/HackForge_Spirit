/**
 * One-off: node server/data/generate-samples.mjs → writes feedback-samples.json (100+ entries)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "feedback-samples.json");

const templates = [
  (i) =>
    `[Complaint] Double charge on invoice INV-${1000 + i} — please reverse the duplicate payment.`,
  (i) => `[Bug] Session expires every 10 minutes on Chrome 120 even with "remember me" checked.`,
  (i) => `[Query] Where can I find API rate limits for our Pro workspace?`,
  (i) => `[Suggestion] Add bulk export for tickets tagged "urgent" in the web console.`,
  (i) => `[Praise] The new search is fast — finding old threads finally takes seconds.`,
  (i) =>
    `[Complaint] Refund for order #${8800 + i} still shows "pending" after 14 business days.`,
  (i) => `[Bug] PDF attachments fail to download on Android when file size exceeds 8MB.`,
  (i) => `[Query] Do you support SAML SSO with Azure AD for teams under 50 seats?`,
  (i) => `[Suggestion] Dark theme for the analytics dashboard would reduce eye strain.`,
  (i) => `[Praise] Support engineer Priya resolved my access issue in one email — amazing.`,
  (i) =>
    `[Complaint] Marketing emails keep arriving after I toggled all notification preferences off.`,
  (i) => `[Bug] GraphQL query returns 500 when filtering by createdAt range crossing midnight UTC.`,
  (i) => `[Query] Can we migrate historical tickets from Zendesk without losing comment threads?`,
  (i) => `[Suggestion] Allow custom fields on the customer portal submission form.`,
  (i) => `[Praise] Release notes for v3.4 were detailed and actually matched what shipped.`,
  (i) => `[Complaint] Wrong tax rate applied to EU invoices — VAT should be 19% for DE.`,
  (i) => `[Bug] Infinite spinner on "Save draft" when title contains emoji characters.`,
  (i) => `[Query] What is the data retention policy for deleted user accounts under GDPR?`,
  (i) => `[Suggestion] Webhook retries with exponential backoff would reduce duplicate events.`,
  (i) => `[Praise] The mobile app offline cache saved us during last week's outage.`,
  (i) =>
    `[Complaint] Account locked after three failed logins — no unlock link in the email body.`,
  (i) => `[Bug] Sorting by "Last updated" reverses order only on the second page of results.`,
  (i) => `[Query] Is two-factor authentication mandatory for admin roles only or all users?`,
  (i) => `[Suggestion] Pin important announcements at the top of the team feed.`,
  (i) => `[Praise] Documentation for webhooks finally includes working curl examples.`,
  (i) =>
    `[Complaint] Shipping label printed with wrong return address for warehouse ${i % 5 || 1}.`,
  (i) => `[Bug] Push notifications stop after app update until I reinstall from the store.`,
  (i) => `[Query] How do I transfer workspace ownership to another verified domain user?`,
  (i) => `[Suggestion] Add CSV import validation preview before committing rows.`,
  (i) => `[Praise] Uptime this quarter has been solid — appreciate the transparency page.`,
  (i) => `[Complaint] Loyalty points from November promo never credited to my account balance.`,
  (i) => `[Bug] Editor loses cursor position when pasting from Google Docs on Safari.`,
  (i) => `[Query] Can invoices be generated in multiple currencies per project?`,
  (i) => `[Suggestion] Role templates (Admin, Analyst, Viewer) would speed provisioning.`,
  (i) => `[Praise] The CLI tool is well documented —Rare for B2B products.`,
  (i) =>
    `[Complaint] Chat queue wait time exceeded 45 minutes during peak — unacceptable SLA.`,
  (i) => `[Bug] Report scheduler sends duplicate emails if job runs past the hour boundary.`,
  (i) => `[Query] Where is the audit log for permission changes in the control plane?`,
  (i) => `[Suggestion] Let us brand the customer-facing status page with our logo.`,
  (i) => `[Praise] Your security whitepaper was thorough enough for our vendor review.`,
  (i) =>
    `[Complaint] Guest checkout order ${720000 + i} missing confirmation email entirely.`,
  (i) => `[Bug] Tooltip overlays block clicks on action buttons in compact table mode.`,
  (i) => `[Query] Do you offer HIPAA BAA for the Enterprise tier in the US region?`,
  (i) => `[Suggestion] Snooze notifications until a specific date on mobile.`,
  (i) => `[Praise] The redesign reduced clicks to resolve a ticket — measurable win.`,
  (i) =>
    `[Complaint] Annual renewal price increased without the 30-day notice promised in contract.`,
  (i) => `[Bug] Time zone dropdown shows duplicate "America/Chicago" entries.`,
  (i) => `[Query] How to revoke API keys for former contractors in bulk?`,
  (i) => `[Suggestion] Inline image thumbnails in comment threads would help triage.`,
  (i) => `[Praise] Fast response on the PCI questionnaire — thanks to the compliance team.`,
  (i) =>
    `[Complaint] Unable to downgrade plan — "Contact sales" loops with no callback.`,
  (i) =>
    `[Bug] Memory leak in desktop app when leaving the analytics tab open overnight.`,
  (i) => `[Query] What are the upload limits for video attachments on the Growth plan?`,
  (i) => `[Suggestion] Tag autocomplete from recent tags would reduce typos.`,
  (i) => `[Praise] Love the weekly digest email format — concise and actionable.`,
  (i) =>
    `[Complaint] Fraudulent login attempt notification arrived 6 hours after the event.`,
  (i) => `[Bug] Emoji reactions not persisting if message edited within 5 seconds.`,
  (i) =>
    `[Query] Can we whitelist IP ranges for admin API access only (not user traffic)?`,
  (i) => `[Suggestion] Export audit trail to Splunk-friendly JSON lines format.`,
  (i) => `[Praise] Your incident postmortems set a good example for our own ops team.`,
  (i) =>
    `[Complaint] Gift card balance shows $0.00 despite purchase receipt from retailer.`,
  (i) => `[Bug] Nested bullet lists render with wrong indent on the customer portal.`,
  (i) => `[Query] Is there a sandbox environment mirroring production configuration?`,
  (i) => `[Suggestion] Optional CAPTCHA only after failed login attempts, not every time.`,
  (i) => `[Praise] The product roadmap blog posts feel honest about trade-offs.`,
  (i) =>
    `[Complaint] Cancellation flow hid the "keep subscription" button below the fold.`,
  (i) => `[Bug] Locale es-MX shows dates in MM/DD instead of DD/MM in exports.`,
  (i) => `[Query] How long are backups retained for accidentally deleted projects?`,
  (i) => `[Suggestion] Keyboard navigate the command palette with arrow keys.`,
  (i) => `[Praise] Integration with Slack works better than Competitor X we migrated from.`,
  (i) =>
    `[Complaint] Spam user reports flood our queue — need better auto-detection controls.`,
  (i) => `[Bug] Heatmap widget blank when dataset has exactly one data point.`,
  (i) =>
    `[Query] Do you have a status page SLA for publishing incidents within N minutes?`,
  (i) => `[Suggestion] Template library for canned responses shared across teams.`,
  (i) => `[Praise] Accessibility improvements in the last release did not go unnoticed.`,
  (i) =>
    `[Complaint] Currency conversion rate frozen at week-old values — caused budget errors.`,
  (i) => `[Bug] Drag-and-drop reorder intermittently drops items on Firefox 115.`,
  (i) =>
    `[Query] Can data residency be pinned to eu-west-1 for all customer PII at signup?`,
  (i) =>
    `[Suggestion] Color-blind safe palette option for charts (not only default rainbow).`,
  (i) =>
    `[Praise] Support follow-up survey is short — actually filled it out for once.`,
  (i) =>
    `[Complaint] Vendor portal login requires password reset every 7 days — too aggressive.`,
  (i) => `[Bug] Printed reports truncate footers on A4 when margins under 12mm.`,
  (i) =>
    `[Query] Is there a formal exit process if we need to export all raw event logs?`,
  (i) =>
    `[Suggestion] Allow "@here" mentions to respect user timezone quiet hours globally.`,
  (i) => `[Praise] Congrats on the SOC 2 Type II milestone — forwarded to our security team.`,
  (i) => `[Complaint] Kids account parental controls reset after parental device OS update.`,
  (i) =>
    `[Bug] Collaboration cursor shows wrong user color when more than 8 editors present.`,
  (i) =>
    `[Query] Minimum contract length if we add 5 seats mid-cycle to existing annual deal?`,
  (i) => `[Suggestion] Preview webhooks before saving endpoint URL with test payload.`,
  (i) => `[Praise] The sample data generator made our demo environment look credible.`,
  (i) =>
    `[Complaint] Checkout error "payment_method_invalid" with valid corporate Amex card.`,
  (i) => `[Bug] Voice notes playback speed resets to 1x on lock screen resume.`,
  (i) =>
    `[Query] Difference between "archived" and Soft-delete for compliance retention rules?`,
  (i) => `[Suggestion] Group similar automated alerts to reduce pager noise.`,
  (i) => `[Praise] Your engineer explained the caching bug without jargon — appreciated.`,
  (i) => `[Complaint] Freight damage claim rejected though photos were uploaded within 48h.`,
  (i) => `[Bug] SSO login redirects to localhost in staging when using custom domain.`,
  (i) => `[Query] Can we pause billing entirely during a documented maintenance window?`,
  (i) => `[Suggestion] Throttle auto-replies so customers do not get 3 emails in one minute.`,
  (i) => `[Praise] The in-app tours are skippable but still useful for new hires.`,
  (i) =>
    `[Complaint] Algorithmic feed surfaces irrelevant content after following one new topic.`,
  (i) =>
    `[Bug] Copy/paste from spreadsheet drops leading zeros in SKU column without warning.`,
  (i) =>
    `[Query] File checksum verification available for large artifact downloads via CLI?`,
  (i) =>
    `[Suggestion] "Undo send" window of 10s for outbound transactional emails optional.`,
  (i) =>
    `[Praise] Sustainability report in the footer influenced our vendor scorecard positively.`,
  (i) =>
    `[Complaint] Dealer locator shows closed locations as open after holiday schedule change.`,
  (i) =>
    `[Bug] Bluetooth LE pairing drops when switching between two paired accessories rapidly.`,
  (i) =>
    `[Query] Penalty fees if we exceed committed cloud storage for Q3 projections slightly?`,
  (i) => `[Suggestion] Slash command /status to post incident updates to linked incidents.`,
  (i) =>
    `[Praise] Transparent pricing page without "contact us" for core tiers helped RFP process.`,
  (i) =>
    `[Complaint] Warranty replacement shipped wrong model number — RMA ${500 + i} stalled.`,
  (i) => `[Bug] High contrast mode hides secondary button borders in modals.`,
  (i) =>
    `[Query] Can annotations on shared PDFs sync in real time for hybrid workshop use?`,
  (i) =>
    `[Suggestion] Customer satisfaction micro-survey after chat close with 1-tap rating.`,
  (i) => `[Praise] API deprecation timeline gave us plenty of runway to migrate webhooks.`,
  (i) =>
    `[Complaint] Batch job #${4200 + i} failed silently—no alert though retries exhausted.`,
  (i) => `[Bug] Two-factor backup codes display blank screen on Safari 17 private browsing.`,
  (i) => `[Query] Is row-level security available on the read-only analytics replica?`,
  (i) => `[Suggestion] Let admins pin a "known issues" banner visible before users submit tickets.`,
  (i) =>
    `[Praise] Neutral and factual tone in last week's outage communication built trust with leadership.`,
  (i) =>
    `[Complaint] Auto-renewal toggle off but card still charged—need statement-level dispute ID.`,
  (i) =>
    `[Bug] Low-complexity UI: typo in footer copyright year shows ${2019 + (i % 5)} despite CMS update.`,
  (i) =>
    `[Query] What is the default session idle timeout for HIPAA-enabled workspaces (medium-priority policy review)?`,
  (i) =>
    `[Suggestion] High-impact ask: add anomaly detection on failed login bursts per IP range.`,
  (i) =>
    `[Praise] The onboarding video series is short, neutral, and covers SSO plus API keys well.`,
  (i) =>
    `[Complaint] Negative experience: callback promised within 1h; still waiting after 6h (case CB-${900 + i}).`,
  (i) =>
    `[Bug] Intermittent 408 on edge CDN only from APAC—simple GET on static assets, medium severity.`,
  (i) =>
    `[Query] Can we route PII-minimized webhooks to a separate endpoint with lower retention?`,
  (i) =>
    `[Suggestion] Low-effort win: remember table column widths per user on the tickets page.`,
  (i) =>
    `[Praise] Positive surprise: changelog RSS feed works in our internal Slack digest bot.`,
  (i) =>
    `[Complaint] Invoice line items missing PO reference ${88000 + i}—blocking month-end close.`,
];

const MIN_MESSAGES = 100;
const COUNT = 120;
if (COUNT < MIN_MESSAGES) {
  throw new Error(`generate-samples: COUNT (${COUNT}) must be >= ${MIN_MESSAGES}`);
}

const messages = [];
for (let i = 0; i < COUNT; i++) {
  messages.push(templates[i % templates.length](i + 1));
}

if (messages.length < MIN_MESSAGES) {
  throw new Error(`generate-samples: expected at least ${MIN_MESSAGES} messages`);
}

fs.writeFileSync(OUT, JSON.stringify({ messages }, null, 2), "utf8");
console.log("Wrote", OUT, "with", messages.length, "messages");
