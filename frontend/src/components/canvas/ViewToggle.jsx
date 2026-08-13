import { useFlowStore } from '@store/flowStore'
import { Button } from '@components/common/Button'

export function ViewToggle() {
  const { viewMode, setViewMode } = useFlowStore()

  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      <Button
        variant={viewMode === '2d' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setViewMode('2d')}
      >
        2D
      </Button>
      <Button
        variant={viewMode === '3d' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setViewMode('3d')}
      >
        3D
      </Button>
    </div>
  )
}
