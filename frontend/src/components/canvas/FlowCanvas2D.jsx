/**
 * Componente Canvas 2D con React Flow
 */
import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeTypes = {};

const FlowCanvas2D = ({ initialNodes = [], initialEdges = [], onNodesChange, onEdgesChange }) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flow-canvas-2d">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange || onNodesChangeInternal}
        onEdgesChange={onEdgesChange || onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
      >
        <Background color="#888" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#22c55e';
              case 'end':
                return '#ef4444';
              case 'process':
                return '#3b82f6';
              case 'decision':
                return '#f59e0b';
              default:
                return '#6366f1';
            }
          }}
          maskColor="rgba(240, 240, 240, 0.6)"
        />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas2D;
