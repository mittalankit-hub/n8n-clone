"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import {memo, type ReactNode} from  "react"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node"
import Image from "next/image"
import { NodeStatusIndicator, type NodeStatus } from "@/components/react-flow/node-status-indicator"

interface BaseExecutionNodeProps extends NodeProps {
    icon : LucideIcon | string;
    name : string;
    description? : string;
    children? : ReactNode;
    status? : "initial" | NodeStatus;
    onSetting?: ()=>void;
    onDoubleClick?: ()=>void;
}

export const BaseExecutionNode = memo(({id,icon:Icon, name, description, children, onSetting, onDoubleClick,status}:BaseExecutionNodeProps)=>{
    const {setNodes,setEdges} = useReactFlow()
        
    const handleDelete = ()=>{
            setNodes((currentNodes)=>{
                return currentNodes.filter((node)=> node.id !== id)
            })
            setEdges((currentEdges)=>{
                return currentEdges.filter((edge)=> edge.source !== id && edge.target !== id)
            })
        }
    return(
        <WorkflowNode name={name} description={description} onDelete={handleDelete} onSettings={onSetting}>
            <NodeStatusIndicator status={status} variant="border">
                <BaseNode status={status} onDoubleClick={onDoubleClick}>
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
                        <BaseHandle id="target-1" type="target" position={Position.Left}/>
                        <BaseHandle id="source-1" type="source" position={Position.Right}/>
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    )

})

BaseExecutionNode.displayName = "BaseExecutionNode"
