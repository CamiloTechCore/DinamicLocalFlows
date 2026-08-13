import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useFlowStore } from '@store/flowStore'
import { flowService } from '@services/api'
import { Button } from '@components/common/Button'

const STEPS = ['Basic Data', 'Nodes', 'Connections']

export function FlowWizard() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const {
    flowMetadata,
    setFlowMetadata,
    nodes,
    edges,
    addNode,
    currentFlowId,
    setCurrentFlowId,
    loadFlow,
  } = useFlowStore()

  const [newNodeType, setNewNodeType] = useState('process')
  const [newNodeLabel, setNewNodeLabel] = useState('')

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return
    const id = `node-${uuidv4().slice(0, 8)}`
    const yOffset = nodes.length * 80 + 50
    addNode({
      id,
      type: newNodeType,
      position: { x: 250, y: yOffset },
      data: { label: newNodeLabel },
    })
    setNewNodeLabel('')
  }

  const handleSave = async () => {
    if (!flowMetadata.name.trim()) {
      setMessage('Flow name is required')
      return
    }
    try {
      setSaving(true)
      setMessage('')
      const payload = {
        name: flowMetadata.name,
        description: flowMetadata.description,
        workspace: flowMetadata.workspace || null,
        nodes: nodes.map((n) => ({
          ...n,
          label: n.data?.label || n.label || n.type,
        })),
        edges,
      }
      if (currentFlowId) {
        const res = await flowService.updateFlow(currentFlowId, payload, flowMetadata.workspace)
        loadFlow(res.data.data)
        setMessage('Flow updated successfully')
      } else {
        const res = await flowService.createFlow(payload)
        loadFlow(res.data.data)
        setCurrentFlowId(res.data.data.id)
        setMessage('Flow saved successfully')
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to save flow')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    if (!currentFlowId) {
      setMessage('Save the flow first before exporting')
      return
    }
    try {
      const res = await flowService.exportFlow(currentFlowId, flowMetadata.workspace)
      const ascii = res.data.ascii
      await navigator.clipboard.writeText(ascii)
      setMessage('ASCII diagram copied to clipboard')
    } catch {
      setMessage('Export failed — is the backend running?')
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              step === i
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-gray-400"
            placeholder="Flow name *"
            value={flowMetadata.name}
            onChange={(e) => setFlowMetadata({ ...flowMetadata, name: e.target.value })}
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-gray-400"
            placeholder="Description"
            value={flowMetadata.description}
            onChange={(e) => setFlowMetadata({ ...flowMetadata, description: e.target.value })}
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-gray-400"
            placeholder="Workspace (optional)"
            value={flowMetadata.workspace || ''}
            onChange={(e) => setFlowMetadata({ ...flowMetadata, workspace: e.target.value || null })}
          />
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-wrap items-end gap-3">
          <select
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value)}
          >
            <option value="start">Start</option>
            <option value="process">Process</option>
            <option value="decision">Decision</option>
            <option value="end">End</option>
          </select>
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-gray-400"
            placeholder="Node label"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
          />
          <Button size="sm" onClick={handleAddNode}>
            Add Node
          </Button>
          <span className="text-sm text-gray-400">{nodes.length} nodes on canvas</span>
        </div>
      )}

      {step === 2 && (
        <div className="text-sm text-gray-300">
          <p>Connect nodes by dragging from one handle to another on the 2D canvas.</p>
          <p className="mt-1">Current connections: <strong>{edges.length}</strong></p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        {step > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 && (
          <Button size="sm" variant="outline" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : currentFlowId ? 'Update Flow' : 'Save Flow'}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleExport}>
          Export ASCII
        </Button>
        {message && <span className="text-sm text-blue-300">{message}</span>}
      </div>
    </div>
  )
}
