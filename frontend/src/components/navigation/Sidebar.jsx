import { useCallback, useEffect, useState } from 'react'
import { flowService } from '@services/api'
import { useFlowStore } from '@store/flowStore'
import { useWorkspaceStore } from '@store/workspaceStore'
import { Button } from '@components/common/Button'

export function Sidebar() {
  const [flows, setFlows] = useState([])
  const [loading, setLoading] = useState(true)
  const { loadFlow, resetFlow, currentFlowId } = useFlowStore()
  const { workspaces, setWorkspaces } = useWorkspaceStore()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [flowsRes, workspacesRes] = await Promise.all([
        flowService.listFlows(),
        flowService.listWorkspaces(),
      ])
      setFlows(flowsRes.data.data || [])
      setWorkspaces(workspacesRes.data.data || [])
    } catch (err) {
      console.error('Failed to load sidebar data:', err)
    } finally {
      setLoading(false)
    }
  }, [setWorkspaces])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    fetchData()
  }, [fetchData])

  const handleSelectFlow = (flow) => {
    loadFlow(flow)
  }

  return (
    <aside className="w-72 h-full bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-xl flex flex-col text-white">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-bold text-white">DinamicLocalFlows</h2>
        <p className="text-xs text-gray-300 mt-1">Dynamic flow designer</p>
      </div>

      <div className="p-4 flex gap-2">
        <Button size="sm" className="flex-1" onClick={resetFlow}>
          New Flow
        </Button>
        <Button size="sm" variant="outline" onClick={fetchData}>
          Refresh
        </Button>
      </div>

      {workspaces.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 uppercase mb-1">Workspaces</p>
          <div className="flex flex-wrap gap-1">
            {workspaces.map((ws) => (
              <span
                key={ws.name}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {ws.icon || '📁'} {ws.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-xs text-gray-400 uppercase mb-2">Saved Flows</p>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : flows.length === 0 ? (
          <p className="text-sm text-gray-400">No saved flows yet</p>
        ) : (
          <ul className="space-y-2">
            {flows.map((flow) => (
              <li key={flow.id}>
                <button
                  onClick={() => handleSelectFlow(flow)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentFlowId === flow.id
                      ? 'bg-blue-500/30 border border-blue-400/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <p className="font-medium text-sm">{flow.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {flow.description || 'No description'}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
