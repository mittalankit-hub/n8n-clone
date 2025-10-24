"use client"
import { EntityContainer, EntityEmptyView, EntityErrorView, EntityHeader, EntityItem, EntityList, EntityLoadingView, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import type {Workflow} from "@/generated/prisma"
import { WorkflowIcon } from "lucide-react"
import {formatDistanceToNow} from "date-fns"


export const WorkflowsPagination = ()=>{
    const workflows = useSuspenseWorkflows()
    const [params,setParams] = useWorkflowsParams()

    return(
        <EntityPagination 
        disabled={workflows.isFetching}
        totalPages={workflows.data.totalPages}
        page={workflows.data.page}
        onPageChange={(page)=> setParams({...params , page})}
        />
    )
}
export const WorkflowsSearch =()=>{

    const [params,setParams] = useWorkflowsParams()
    const {searchValue,onSearchChange} = useEntitySearch({params,setParams})
    return (
        <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows"/>
    )
}

export const WorkflowsList =()=>{

    const workflows =useSuspenseWorkflows()

    return(
        <EntityList 
        items={workflows.data.items} 
        getKey={(workflow)=>workflow.id} 
        renderItem={ (workflow)=><WorkflowItem data={workflow}/>} 
        emptyView={<WorkflowsEmpty/>}/>
    )
    // return (
    //     <div className="flex-1 flex justify-center items-center">
    //         {workflows.data.items.length === 0 && <WorkflowsEmpty/>}
    //         {workflows.data.items.length > 0 &&
    //         <p>
    //             {JSON.stringify(workflows.data,null,2)}
    //         </p>}
    //     </div>
    // )
}

export const WorkflowHeader =({disabled}:{disabled?:boolean})=>{

    const createWorkflow = useCreateWorkflow()
    const {handleError,modal} = useUpgradeModal()
    const router = useRouter()

    const handleCreate = ()=>{
        createWorkflow.mutate(undefined,{
            onSuccess: (data)=>{
                router.push(`/workflows/${data.id}`)
            },
            onError: (error)=>{
                console.log("inside error handle create error")
                handleError(error)
            }})
    }
    return(
        <>
            {modal}
            <EntityHeader title="Workflows" 
            description="Create and manage workflows" 
            onNew={handleCreate} 
            newButtonLabel="New Workflow" 
            disabled={disabled} 
            isCreating={createWorkflow.isPending}/>
        </>
    )
}

export const WorkflowContainer = ({children}:{ children:React.ReactNode})=>{

    return (
        <EntityContainer 
            header = {<WorkflowHeader />}
            search = {<WorkflowsSearch />}
            pagination = {<WorkflowsPagination/>}
            children = {children}
        />
            
       

    )
}

export const WorkflowsLoading = ()=> {

    return (
        <EntityLoadingView entity="workflows"/>
    )
}

export const WorkflowsError = ()=> {

    return (
        <EntityErrorView entity="workflows"/>
    )
}

export const WorkflowsEmpty = ()=> {

    return (
        <EntityEmptyView entity="workflow"/>
    )
}


export const WorkflowItem = ({data}:{data:Workflow})=>{

    const removeWorkflow = useRemoveWorkflow()

    const handleRemove = ()=>{removeWorkflow.mutate({id: data.id})}

    return(
        <EntityItem 
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
                Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
                &bull; Created{" "}{formatDistanceToNow(data.createdAt,{addSuffix:true})}
                
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center ">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving={false}
        />
    )

}
