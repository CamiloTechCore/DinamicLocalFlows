import { lazy, Suspense } from 'react'
import { Canvas2D } from '@components/canvas/Canvas2D'
import { ViewToggle } from '@components/canvas/ViewToggle'
import { useFlowStore } from '@store/flowStore'

const Canvas3D = lazy(() =>
  import('@components/canvas/Canvas3D').then((mod) => ({ default: mod.Canvas3D })),
)

export function FlowCanvas() {
  const { viewMode } = useFlowStore()

  return (
    <div className="relative w-full h-full">
      <ViewToggle />
      {viewMode === '2d' ? (
        <Canvas2D />
      ) : (
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-white/70">
              Loading 3D view...
            </div>
          }
        >
          <Canvas3D />
        </Suspense>
      )}
    </div>
  )
}
