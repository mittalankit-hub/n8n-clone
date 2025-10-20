
import prisma from '@/lib/prisma';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { create } from 'domain';
import { inngest } from '@/inngest/client';


export const appRouter = createTRPCRouter({



  getWorkflows: protectedProcedure
    .query(async () => {
      return await prisma.workflow.findMany();
    }),

  createWorkflow: protectedProcedure.mutation(async ()=>{
    await inngest.send({
      name:"create/workflow",
      data:{
        name:"test-workflow",
    }})
    return { success: true , message:"Workflow creation job queued"}
  }),

    testGeminiAi: protectedProcedure.mutation(async ()=>{
       console.log("Triggering Gemini AI execution function");
       await inngest.send({name:"executeGeminiAI/ai",});
       return { success: true , message:"Gemini AI  job queued"}
    }),
       testOpenAi: protectedProcedure.mutation(async ()=>{
       console.log("Triggering Open AI execution function");
       await inngest.send({name:"executeOpenAI/ai",});
       return { success: true , message:"Open AI  job queued"}
    }),

       testAnthropicAi: protectedProcedure.mutation(async ()=>{
       console.log("Triggering Anthropic AI execution function");
       await inngest.send({name:"executeAnthropicAI/ai",});
       return { success: true , message:"Anthropic AI  job queued"}
    }),

});
// export type definition of API
export type AppRouter = typeof appRouter;
