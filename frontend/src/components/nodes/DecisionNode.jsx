import { Handle, Position } from '@xyflow/react'

export default function DecisionNode({ data }) {
  return (
    <div
      className="px-2 py-2 shadow-lg bg-yellow-500 text-black font-bold border-2 border-yellow-600 text-xs text-center"
      style={{
        transform: 'rotate(45deg)',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ transform: 'rotate(-45deg)' }}>{data.label || '?'}</span>
      <Handle type="target" position={Position.Top} style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ transform: 'rotate(-45deg)' }} />
    </div>
  )
}
