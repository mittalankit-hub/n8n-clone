import prisma from "@/lib/prisma";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5");
    await step.sleep("wait-a-moment", "5");
    await step.run("create-workflow)",async()=>{
        return prisma.workflow.create({
            data:{
                name: "New Worflow From Inngest"
            }
        })
    })
    return { message: `Hello ${event.data.email}!` };
  },
);