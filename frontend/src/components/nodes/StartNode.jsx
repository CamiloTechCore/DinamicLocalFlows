import { Handle, Position } from "@xyflow/react";

export default function StartNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-full bg-green-500 text-white font-bold border-2 border-green-600">
      {data.label || 'Inicio'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}