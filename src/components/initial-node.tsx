"use client"
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";
import { se } from "date-fns/locale";


export const InitialNode = memo((props:NodeProps)=>{
    const [selectorOpen, setSelectorOpen] = useState(false)
    return(
        <NodeSelector open={selectorOpen} onOpenchange={setSelectorOpen}>
            <WorkflowNode showToolBar={false}>
            <PlaceholderNode {...props} onClick={()=>setSelectorOpen(true)}>
                <div className="cursor-pointer flex items-center justify-center">
                    <PlusIcon />
                </div>
            </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>

    )
})