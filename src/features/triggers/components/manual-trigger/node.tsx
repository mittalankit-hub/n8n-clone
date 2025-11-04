"use client"
import type {Node,NodeProps,useReactFlow} from "@xyflow/react"
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

type HttpRequestNodeData ={
    endpoint? : string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string,
    [key:string] : unknown
};


export const ManualTriggerNode = memo((props:NodeProps)=>{
    const [dialogOpen,setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const nodeStatus = "initial"

    return(
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode 
        {...props} 
        id={props.id} 
        icon={MousePointerIcon} 
        name="When clicking 'Execute workflow'"
       status ={nodeStatus}

        onSetting={handleOpenSettings}
        onDoubleClick={handleOpenSettings} 
        />
        </>
    )
})

ManualTriggerNode.displayName = "ManualTriggerNode"