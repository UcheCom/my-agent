import { generateText } from "ai";
// Import the Google module from the ai-sdk/google package
import { google } from "@ai-sdk/google";

// Specify the Google model to use for text generation and a prompt
const { text } = await generateText({
  model: google("gemini-2.0-flash-001"),
  prompt: "What is an AI Agent?",
});

// Log the result to the console
console.log(text);
