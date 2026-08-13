import { useRef, useEffect, useMemo, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { useFlowStore } from '@store/flowStore'

export function Canvas3D() {
  const containerRef = useRef(null)
  const graphRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const { nodes, edges } = useFlowStore()

  const graphData = useMemo(() => {
    const graphNodes = nodes.map((node) => ({
      id: node.id,
      name: node.data?.label || node.type,
      val: node.type === 'decision' ? 3 : 1,
      color: {
        start: '#22c55e',
        end: '#ef4444',
        process: '#3b82f6',
        decision: '#eab308',
      }[node.type] || '#94a3b8',
    }))

    const graphLinks = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }))

    return { nodes: graphNodes, links: graphLinks }
  }, [nodes, edges])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition({ z: 300 })
    }
  }, [graphData])

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900/50">
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        linkColor={() => '#64748b'}
        backgroundColor="rgba(15, 23, 42, 0.5)"
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  )
}
