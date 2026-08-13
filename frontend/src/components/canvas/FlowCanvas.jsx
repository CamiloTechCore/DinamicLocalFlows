import { Canvas2D } from '@components/canvas/Canvas2D'
import { Canvas3D } from '@components/canvas/Canvas3D'
import { ViewToggle } from '@components/canvas/ViewToggle'
import { useFlowStore } from '@store/flowStore'

export function FlowCanvas() {
  const { viewMode } = useFlowStore()

  return (
    <div className="relative w-full h-full">
      <ViewToggle />
      {viewMode === '2d' ? <Canvas2D /> : <Canvas3D />}
    </div>
  )
}
