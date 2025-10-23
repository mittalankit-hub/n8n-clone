import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


/**
 * Hook to fetch all workflows using suspense
 */

export const useSuspenseWorkflows = ()=>{

    const trpc = useTRPC()

    return useSuspenseQuery(trpc.workflows.getAll.queryOptions())
}

export const useCreateWorkflow = ()=>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

        return useMutation(trpc.workflows.create.mutationOptions({
            onSuccess : (data)=>{
                toast.success(`Workflow ${data.name} created `)
                queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions())
            },
            onError: (error)=>{
                toast.error(`Failed to create workflow: ${error.message}`)
            }
        }))
}