import { inngest } from "@/inngest/client";
import { createWorkflow, executeAnthropicAI, executeGeminiAI, executeOpenAI } from "@/inngest/functions";
import { create } from "domain";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createWorkflow,
    executeGeminiAI,
    executeOpenAI,
    executeAnthropicAI
  ],
});