import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useFlowStore } from '@store/flowStore'
import StartNode from '@components/nodes/StartNode'
import EndNode from '@components/nodes/EndNode'
import ProcessNode from '@components/nodes/ProcessNode'
import DecisionNode from '@components/nodes/DecisionNode'

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
}

export function Canvas2D() {
  const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges } = useFlowStore()
  const [nodes, setNodesState, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(storeEdges)

  useEffect(() => {
    setNodesState(storeNodes)
  }, [storeNodes, setNodesState])

  useEffect(() => {
    setEdgesState(storeEdges)
  }, [storeEdges, setEdgesState])

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes)
      setNodesState((current) => {
        const updated = applyNodeChanges(changes, current)
        setNodes(updated)
        return updated
      })
    },
    [onNodesChange, setNodesState, setNodes],
  )

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes)
      setEdgesState((current) => {
        const updated = applyEdgeChanges(changes, current)
        setEdges(updated)
        return updated
      })
    },
    [onEdgesChange, setEdgesState, setEdges],
  )

  const onConnect = useCallback(
    (connection) => {
      setEdgesState((current) => {
        const updated = addEdge(connection, current)
        setEdges(updated)
        return updated
      })
    },
    [setEdgesState, setEdges],
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-900/50"
      >
        <Background color="#334155" gap={16} />
        <Controls className="!bg-white/10 !border-white/20" />
        <MiniMap className="!bg-slate-800/80" />
      </ReactFlow>
    </div>
  )
}
