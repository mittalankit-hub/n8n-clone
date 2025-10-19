
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
      name:"test/hello.world",
      data:{
        email:"ankit.mittal@elevate.law"
    }})
    return { success: true , message:"Workflow creation job queued"}
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;
