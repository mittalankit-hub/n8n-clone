"use client"
import { EntityErrorView, EntityLoadingView } from "@/components/entity-components"
import { useSuspenseSingleWorkflow } from "@/features/workflows/hooks/use-workflows"
import { useState, useCallback } from 'react';
import { nodeComponents } from "@/config/node-components";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange,type Connection, Background, Controls, MiniMap, Panel} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AddNodeButton } from "./add-node-button";




interface EditorProps{
    workflowId: string
}



export const Editor = ({workflowId}:EditorProps)=>{


    const workflow = useSuspenseSingleWorkflow(workflowId)
    const initialNodes = workflow.data.nodes
    const initialEdges = workflow.data.edges
   const [nodes, setNodes] = useState<Node[]>(initialNodes);
   const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  
   const onNodesChange = useCallback(
    (changes:NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
   const onEdgesChange = useCallback(
    (changes:EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
   const onConnect = useCallback(
    (params:Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return(
    
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        fitView
        proOptions={{hideAttribution:true}}
        
      >
        <Background/>
        <Controls/>
        <MiniMap/>
        <Panel position="top-right" >
            <AddNodeButton/>
        </Panel>
      </ReactFlow>
    
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