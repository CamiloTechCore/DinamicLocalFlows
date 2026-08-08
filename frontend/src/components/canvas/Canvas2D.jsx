import { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react'
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
  const [nodes, setNodesState] = useNodesState(storeNodes)
  const [edges, setEdgesState] = useEdgesState(storeEdges)

  const onConnect = useCallback(
    (connection) => {
      const newEdges = addEdge(connection, edges)
      setEdgesState(newEdges)
      setEdges(newEdges)
    },
    [edges, setEdgesState, setEdges]
  )

  const onNodesChange = useCallback(
    (changes) => {
      setNodesState(changes)
      // Sincronizar con store
    },
    [setNodesState]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}