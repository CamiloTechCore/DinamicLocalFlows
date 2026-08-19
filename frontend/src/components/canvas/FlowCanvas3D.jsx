/**
 * Componente Canvas 3D con React Force Graph
 */
import React, { useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const FlowCanvas3D = ({ nodes = [], edges = [] }) => {
  const fgRef = useRef();

  // Transformar nodos y edges al formato de Force Graph
  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.label,
      type: node.type,
      color: getNodeColor(node.type),
      val: getNodeSize(node.type),
    })),
    links: edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      label: edge.data?.condition || '',
    })),
  };

  return (
    <div className="flow-canvas-3d">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor="color"
        nodeVal="val"
        linkColor="#6366f1"
        linkWidth={2}
        backgroundColor="#0f172a"
        showNavInfo={false}
        enableNodeDrag={true}
        nodeThreeObjectExtend={false}
      />
    </div>
  );
};

// Colores por tipo de nodo
function getNodeColor(type) {
  const colors = {
    start: '#22c55e',    // Verde
    end: '#ef4444',      // Rojo
    process: '#3b82f6',  // Azul
    decision: '#f59e0b', // Amarillo
    subflow: '#8b5cf6',  // Violeta
    input: '#06b6d4',    // Cyan
    output: '#ec4899',   // Rosa
  };
  return colors[type] || '#6366f1';
}

// Tamaño por tipo de nodo
function getNodeSize(type) {
  const sizes = {
    start: 12,
    end: 12,
    process: 10,
    decision: 14,
    subflow: 11,
    input: 9,
    output: 9,
  };
  return sizes[type] || 10;
}

export default FlowCanvas3D;
