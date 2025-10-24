"use client"
import { EntityErrorView, EntityLoadingView } from "@/components/entity-components"
import { useSuspenseSingleWorkflow } from "@/features/workflows/hooks/use-workflows"


interface EditorProps{
    workflowId: string
}

export const Editor = ({workflowId}:EditorProps)=>{

   const workflow =  useSuspenseSingleWorkflow(workflowId)
   return (
    <div>
        Workflow ID: {JSON.stringify(workflow.data?.name,null,2)}
    </div>
   )
}

export const EditorLoading = ()=>{

    return(
        <EntityLoadingView entity="workflow"/>
    )
}

export const EditorError = ()=>{

    return(
        <EntityErrorView entity="workflow"/>
    )
}