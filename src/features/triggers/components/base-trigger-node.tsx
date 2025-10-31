"use client"

import { type NodeProps, Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import {memo, type ReactNode} from  "react"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node"
import Image from "next/image"

interface BaseTriggerNodeProps extends NodeProps {
    icon : LucideIcon | string;
    name : string;
    description? : string;
    children? : ReactNode;
   // status? : NodeStatus;
    onSetting?: ()=>void;
    onDoubleClick?: ()=>void;
}

export const BaseTriggerNode = memo(({id,icon:Icon, name, description, children, onSetting, onDoubleClick}:BaseTriggerNodeProps)=>{
    const handleDelete = ()=>{}
    return(
        <WorkflowNode name={name} description={description} onDelete={handleDelete} onSettings={onSetting}>
            <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {typeof Icon === "string" ? 
                    (
                        <Image src={Icon} alt={name} width={16} height={16}/>    
                    ) : 
                    (
                        <Icon className="size-4 text-muted-foreground"/>
                    )
                    }
                    {children}

                    <BaseHandle id="source-1" type="source" position={Position.Right}/>
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )

})

BaseTriggerNode.displayName = "BaseTriggerNode"
