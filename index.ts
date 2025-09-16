// For quick reference during development

/*import { generateText } from "ai";
// Import the Google module from the ai-sdk/google package
import { google } from "@ai-sdk/google";

// Specify the Google model to use for text generation and a prompt
const { text } = await generateText({
  model: google("gemini-2.0-flash-001"),
  prompt: "What is an AI Agent?",
});

// Log the result to the console
console.log(text);*/

import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getFileChangesInDirectoryTool, generateCommitMessageTool, writeMarkdownFileTool } from "./tools";

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      generateCommitMessageTool: generateCommitMessageTool,
      writeMarkdownFileTool: writeMarkdownFileTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

// Specify which directory the code review agent should review changes in your prompt
await codeReviewAgent(
  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file",
);
