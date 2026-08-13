import { Handle, Position } from '@xyflow/react'

export default function ProcessNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-blue-500 text-white font-semibold border-2 border-blue-600 min-w-[100px] text-center">
      {data.label || 'Process'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
