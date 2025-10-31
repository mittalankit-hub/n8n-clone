"use client"
import type {Node,NodeProps,useReactFlow} from "@xyflow/react"
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
type HttpRequestNodeData ={
    endpoint? : string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string,
    [key:string] : unknown
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const ManualTriggerNode = memo((props:NodeProps)=>{

    return(
        <>
        <BaseTriggerNode 
        {...props} 
        id={props.id} 
        icon={MousePointerIcon} 
        name="When clicking 'Execute workflow'"
        // status ={nodeStatus}

        //onSetting={handleOpenSettings}
        //onDoubleClick={handleOpenSettings} 
        />
        </>
    )
})

ManualTriggerNode.displayName = "ManualTriggerNode"