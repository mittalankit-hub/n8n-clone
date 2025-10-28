"use client"
import { useRenameWorkflow, useSuspenseSingleWorkflow } from "@/features/workflows/hooks/use-workflows";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";


interface EditorHeaderProps{
    workflowId: string
}

export const EditorSaveButton = ({workflowId}:EditorHeaderProps) => {
    return(
        <div className="ml-auto">
            <Button size="sm" onClick={()=>{}} disabled={false}>
                <SaveIcon className="size-4"/>
                Save
            </Button>
        </div>
    )
}


export const EditorNameInput = ({workflowId}:EditorHeaderProps)=>{

    const {data} =  useSuspenseSingleWorkflow(workflowId)
    const updatedWorkflowName = useRenameWorkflow()
    const [isEditing, setIsEditing] = useState(false)
    const [name,setName] = useState(data.workflow.name)
    const inputRef  = useRef<HTMLInputElement>(null)
    // useEffect(()=>{
    //     if(data.name)
    //     {
    //         setName(data.name)
    //     }
    // },[data.name])

    useEffect(()=>{
        if(isEditing && inputRef.current){
            inputRef.current.focus()
            inputRef.current.select()
        }
    },[isEditing])

    const handleSave = async()=>{
        if(name === data.workflow.name ){
            setIsEditing(false)
            return
        }
       
        try{
            await updatedWorkflowName.mutateAsync({
                id: workflowId,
                name: name
            })
        }
        catch{
            setName(data.workflow.name) 
        }finally{
             setIsEditing(false)
        }
    }

    const handleKeyDown = (e:React.KeyboardEvent)=>{
        if(e.key === 'Enter'){
            handleSave();
        } else if(e.key==='Escape'){
            setName(data.workflow.name);
            setIsEditing(false)
        }
    }

    if(isEditing){
        return(
            <Input 
                disabled={updatedWorkflowName.isPending}
                ref={inputRef}
                value={name}
                onChange={(e)=>setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 w-auto min-w-[100px] px-2"
            />
        )
    }
    return(
        <BreadcrumbItem onClick={()=>setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {data.workflow.name}
        </BreadcrumbItem>
    )
}

export const EditorHeader = ({workflowId}:EditorHeaderProps) => {
    return (
        <header className="flex items-center h-14 shrink-0 gap-2 border-b px-4 bg-background">
            
                <SidebarTrigger/>
                <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <Breadcrumb className="flex">
                    <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/workflows" prefetch>Workflow</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                        <EditorNameInput workflowId={workflowId}/>
                    </BreadcrumbList>
            </Breadcrumb>
                    <EditorSaveButton workflowId={workflowId}/>
                </div>
        </header>
    )
}