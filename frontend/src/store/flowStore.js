import { create } from 'zustand'

const defaultNodes = [
  {
    id: 'node-start',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Start' },
  },
  {
    id: 'node-process',
    type: 'process',
    position: { x: 250, y: 180 },
    data: { label: 'Process' },
  },
  {
    id: 'node-end',
    type: 'end',
    position: { x: 250, y: 310 },
    data: { label: 'End' },
  },
]

const defaultEdges = [
  { id: 'edge-1', source: 'node-start', target: 'node-process' },
  { id: 'edge-2', source: 'node-process', target: 'node-end' },
]

export const useFlowStore = create((set) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  currentFlowId: null,
  flowMetadata: {
    name: '',
    description: '',
    workspace: null,
  },
  currentWorkspace: null,
  viewMode: '2d',

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  removeEdge: (edgeId) =>
    set((state) => ({ edges: state.edges.filter((e) => e.id !== edgeId) })),
  setFlowMetadata: (metadata) => set({ flowMetadata: metadata }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentFlowId: (id) => set({ currentFlowId: id }),
  setViewMode: (viewMode) => set({ viewMode }),
  loadFlow: (flow) =>
    set({
      nodes: (flow.nodes || []).map((n) => ({
        ...n,
        data: n.data?.label ? n.data : { ...n.data, label: n.label || n.type },
      })),
      edges: flow.edges || [],
      currentFlowId: flow.id,
      flowMetadata: {
        name: flow.name || '',
        description: flow.description || '',
        workspace: flow.workspace || null,
      },
    }),
  resetFlow: () =>
    set({
      nodes: defaultNodes,
      edges: defaultEdges,
      currentFlowId: null,
      flowMetadata: { name: '', description: '', workspace: null },
    }),
}))
