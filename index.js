import "dotenv/config";
import { getAIResponse } from "./ai/service.js";

const input = process.argv.slice(2).join(" ").trim();
const message = input || "Payment failed and money got deducted but order not placed.";

const result = await getAIResponse(message);
process.stdout.write(JSON.stringify(result, null, 2) + "\n");

