import "dotenv/config";
import { getAIResponse } from "./ai/service.js";

const tests = [
  
  "What should I do if I forget my login details?",
  "How can I change my email address?",
  "Where can I find my order history?",
  "How do I update my profile information?",
  "Please fix the issue with the app crashing on startup.",

];

for (const message of tests) {
  // eslint-disable-next-line no-console
  console.log("\n==============================");
  // eslint-disable-next-line no-console
  console.log("INPUT:");
  // eslint-disable-next-line no-console
  console.log(message);
  // eslint-disable-next-line no-console
  console.log("\nOUTPUT:");

  try {
    const result = await getAIResponse(message);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error calling getAIResponse:", err?.message ?? err);
  }
}

