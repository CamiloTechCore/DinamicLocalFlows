import { Handle, Position } from '@xyflow/react'

export default function EndNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-full bg-red-500 text-white font-bold border-2 border-red-600">
      {data.label || 'End'}
      <Handle type="target" position={Position.Top} />
    </div>
  )
}
