import { NodeType } from "@/generated/prisma";
import {createId} from "@paralleldrive/cuid2"
import { GlobeIcon, Icon, MousePointerIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

export type NodeTypeOption ={
    type:NodeType;
    label:string;
    description:string;
    icon: React.ComponentType<{className?:string}>|string
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger Manually",
        description:"Runs the flow on clicking a button. Good for getting started quickly",
        icon:MousePointerIcon
    }
]

const executionNodes: NodeTypeOption[] =[
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description:"Makes and HTTP Request",
        icon:GlobeIcon
    }
]

interface NodeSelectorProps {
    open:boolean,
    onOpenchange: (open:boolean)=>void,
    children: React.ReactNode
}
export function NodeSelector ({open,onOpenchange,children}:NodeSelectorProps) {

    const {setNodes, getNodes, screenToFlowPosition} = useReactFlow()
    const handleNodeSelect = useCallback((selection:NodeTypeOption)=>{
        if(selection.type === NodeType.MANUAL_TRIGGER){
            const nodes = getNodes()
            const hasManualTrigger = nodes.some((node)=>node.type === NodeType.MANUAL_TRIGGER)
            if(hasManualTrigger){
                toast.error("Only one manual trigger is allowed per workflow")
                return
            }
        }
        setNodes((nodes)=>{
            const hasInitialTrigger = nodes.some((node)=>node.type === NodeType.INITIAL)
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const flowPosition = screenToFlowPosition({
                x:centerX + (Math.random()- 0.5 ) * 200,
                y:centerY + (Math.random() - 0.5)*200
            })
            const newNode = {
                id:createId(),
                data: {},
                position: flowPosition,
                type: selection.type,
                }
             if(hasInitialTrigger){
                return[newNode]
             }
             return [...nodes,newNode]
            })
            onOpenchange(false)
         
    },[setNodes,getNodes,onOpenchange, screenToFlowPosition])

    return(
    <Sheet open={open} onOpenChange={onOpenchange}>
        <SheetTrigger asChild>
            {children}
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
                <SheetTitle>
                    What triggers this workflow?
                </SheetTitle>
                <SheetDescription>
                    A trigger is a step that starts this workflow
                </SheetDescription>
            </SheetHeader>
            <div>
                {triggerNodes.map((nodeType)=>{
                    const Icon = nodeType.icon;
                    return(
                        <div key={nodeType.type} className=" flex gap-6 w-full justify-start
                        h-auto py-5 px-4 
                        rounded-none 
                        cursor-pointer 
                        border-l-2 border-transparent 
                        hover:border-l-primary "
                        onClick={()=>{handleNodeSelect(nodeType)}}>
                            <div className="flex items-center ">
                                {typeof Icon ==="string" ?(
                                    <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    
                                ):(<Icon className="size-5"/>)}
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="font-medium text-sm">
                                    {nodeType.label}
                                </span>
                                <span className="text-xs text-muted-foreground ">
                                    {nodeType.description}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Separator/>
            <div>
                {executionNodes.map((nodeType)=>{
                    const Icon = nodeType.icon;
                    return(
                        <div key={nodeType.type} className=" flex gap-6 w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary "
                        onClick={()=>{handleNodeSelect(nodeType)}}>
                            <div className="flex items-center">
                                {typeof Icon ==="string" ?(
                                    <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    
                                ):(<Icon className="size-5"/>)}
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="font-medium text-sm">
                                    {nodeType.label}
                                </span>
                                <span className="text-xs text-muted-foreground ">
                                    {nodeType.description}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </SheetContent>
    </Sheet>)
}
