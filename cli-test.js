import "dotenv/config";
import readline from "node:readline";
import { getAIResponse } from "./ai/service.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  if (rl.closed) return;

  rl.question("Enter feedback: ", async (input) => {
    const message = input.trim();

    if (message.toLowerCase() === "exit") {
      // eslint-disable-next-line no-console
      console.log("Exiting...");
      rl.close();
      return;
    }

    if (!message) {
      // eslint-disable-next-line no-console
      console.log("Please enter some feedback, or type 'exit' to quit.");
      ask();
      return;
    }

    try {
      const result = await getAIResponse(message);
      // eslint-disable-next-line no-console
      console.log("\nINPUT:");
      // eslint-disable-next-line no-console
      console.log(message);
      // eslint-disable-next-line no-console
      console.log("\nAI RESPONSE:");
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(result, null, 2));
      // eslint-disable-next-line no-console
      console.log("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error:", err?.message ?? err);
    }

    if (!rl.closed) ask();
  });
}

ask();

