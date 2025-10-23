import { generateSlug } from 'random-word-slugs'
import prisma from "@/lib/prisma";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from 'zod';

export const workflowRouter = createTRPCRouter({

    create: premiumProcedure
    .mutation(async ({ctx})=>{
        const workflow = await prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
            }
        });
        return workflow;
    }),

    remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({ctx,input})=>{

        const deleted = await prisma.workflow.deleteMany({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            }
        });
        return deleted;
    }),

    updateName: protectedProcedure
    .input(z.object({id: z.string(), name: z.string().min(1)}))
    .mutation(async ({ctx,input})=>{

        const updated = await prisma.workflow.update({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            },
            data: {
                name: input.name,
            }
        });
        return updated;
    }),

    getOne: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx,input})=>{
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            }
        });
        return workflow;
    }),

    getAll: protectedProcedure
    .query(async ({ctx})=>{
        const workflows = await prisma.workflow.findMany({
            where: {
                userId: ctx.auth.user.id,
            },
            // orderBy: {
            //     updatedAt: 'desc',
            // }
        });
        return workflows;
    }),
})