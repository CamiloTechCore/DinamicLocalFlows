import { Handle, Position } from "@xyflow/react";

export default function DecisionNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-sm bg-yellow-500 text-black font-bold border-2 border-yellow-600"
         style={{ transform: 'rotate(45deg)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {data.label || '?'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}