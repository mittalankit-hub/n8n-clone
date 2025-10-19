
"use client"
import { requireAuth } from "@/lib/auth-utils";
import { LogoutButton } from "./logout";
import { Button } from "@/components/ui/button";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";



const Page =   () => {
  //await requireAuth();
  const trpc = useTRPC()
  const {data} = useQuery(trpc.getWorkflows.queryOptions())


  const create  = useMutation(trpc.createWorkflow.mutationOptions({
   onSuccess: ()=> {toast.success("Workflow creation job queued")},
  }))

   
   return <div className="flex flex-col gap-y-2">
      protected server components
         <div>
            {JSON.stringify(data,null,2)}   
         </div>
      <div>
         <Button disabled={create.isPending} onClick={()=>create.mutate()}>
            Create Workflow
         </Button>
      </div>
      <LogoutButton />
    </div>
}

export default Page 