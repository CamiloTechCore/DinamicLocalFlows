import create from 'zustand'

export const useFlowStore = create((set) => ({
  // Estado
  nodes: [],
  edges: [],
  flowMetadata: {
    name: '',
    description: '',
    workspace: null,
  },
  currentWorkspace: null,

  // Acciones
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node],
  })),
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== nodeId),
  })),
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge],
  })),
  removeEdge: (edgeId) => set((state) => ({
    edges: state.edges.filter((e) => e.id !== edgeId),
  })),
  setFlowMetadata: (metadata) => set({ flowMetadata: metadata }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  resetFlow: () => set({
    nodes: [],
    edges: [],
    flowMetadata: { name: '', description: '', workspace: null },
  }),
}))