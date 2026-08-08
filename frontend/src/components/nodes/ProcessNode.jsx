import { Handle, Position } from 'react-flow-renderer'

export default function ProcessNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-blue-500 text-white font-semibold border-2 border-blue-600">
      {data.label || 'Proceso'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}