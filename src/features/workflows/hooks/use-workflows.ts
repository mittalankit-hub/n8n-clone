import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useWorkflowsParams } from "./use-workflows-params"


/**
 * Hook to fetch all workflows using suspense
 */

export const useSuspenseWorkflows = ()=>{

    const trpc = useTRPC()
    const [params] = useWorkflowsParams()

    return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params))
}

export const useCreateWorkflow = ()=>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

        return useMutation(trpc.workflows.create.mutationOptions({
            onSuccess : (data)=>{
                toast.success(`Workflow ${data.name} created `)
                queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}))
            },
            onError: (error)=>{
                toast.error(`Failed to create workflow: ${error.message}`)
            }
        }))
}

export const useRemoveWorkflow = ()=>{
        const queryClient = useQueryClient()
        const trpc = useTRPC()

        return useMutation(trpc.workflows.remove.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow ${data.name} deleted`)
                queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}))
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id:data.id}))
            }
        }))
}