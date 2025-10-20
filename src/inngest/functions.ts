import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import * as Sentry from "@sentry/nextjs";


const openai = createOpenAI({
  // custom settings, e.g.
  headers: {
    'header-name': 'header-value',
  },
});


const anthropic = createAnthropic({
  // custom settings
});

const google = createGoogleGenerativeAI();

export const executeGeminiAI = inngest.createFunction(
    { id: "execute-executeGeminiAI" },
  { event: "executeGeminiAI/ai" },

  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5");
    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
    console.warn('This is a test warning log for Sentry integration');
    console.error('This is a test error log for Sentry integration');
    
    const {steps} = await step.ai.wrap("gemini-generate-text",generateText,{
      model: google("gemini-2.5-flash"),
      system: 'You are a helpful assistant that helps users to generate text based on their prompts.',
      prompt: "Write a short poem about the beauty of nature.",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
  },
    })

    return step
  },
);


export const executeAnthropicAI = inngest.createFunction(
    { id: "execute-executeAnthropicAI" },
  { event: "executeAnthropicAI/ai" },

  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5");
    
    const {steps} = await step.ai.wrap("anthropic-generate-text",generateText,{
      model: anthropic("claude-3-haiku-20240307"),
      system: 'You are a helpful assistant that helps users to generate text based on their prompts.',
      prompt: "Write a short poem about the beauty of nature.",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
  },
    })

    return step
  },
);

export const executeOpenAI = inngest.createFunction(
    { id: "execute-executeOpenAI" },
  { event: "executeOpenAI/ai" },

  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5");
    
    const {steps} = await step.ai.wrap("openai-generate-text",generateText,{
      model: openai("gpt-5"),
      system: 'You are a helpful assistant that helps users to generate text based on their prompts.',
      prompt: "Write a short poem about the beauty of nature.",
      experimental_telemetry: { 
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
  },
    })

    return step
  },
);

export const createWorkflow = inngest.createFunction(
  { id: "create-workflow" },
  { event: "create/workflow" },

  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5");
    await step.run("create-workflow",async()=>{
        return prisma.workflow.create({
            data:
            {
                name: event.data.name || "Default Workflow Name"
            }
            })
        })
    return { message: `Workflow Created` };
 },
);