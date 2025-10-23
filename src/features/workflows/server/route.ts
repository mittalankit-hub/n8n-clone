import { generateSlug } from 'random-word-slugs'
import prisma from "@/lib/prisma";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from 'zod';
import { PAGINATION } from '@/config/constants';

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
    .input(z.object({
      page: z.number().default(PAGINATION.DEFAULT_PAGE),
      pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
      search:z.string().default("") 
    }))
    .query(async ({ctx,input})=>{

        const {page,pageSize,search} = input
        const [items,totalCount] = await Promise.all([
            prisma.workflow.findMany({
                skip: (page-1)*pageSize,
                take: pageSize,
                where:{
                    userId:ctx.auth.user.id,
                    name:{
                        contains: search,
                        mode:"insensitive"
                    }
                },
                orderBy:{
                    updatedAt:"desc"
                }
            }),
            prisma.workflow.count({
                where:{
                    userId:ctx.auth.user.id,
                    name:{
                        contains: search,
                        mode:"insensitive"
                    }
                }
            })
        ])
        const totalPages = Math.ceil(totalCount/pageSize)
        const hasNextPage = page < totalPages
        const hasPreviousPage = page > 1    

        return {
            items,
            page, 
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        }
    }),
})