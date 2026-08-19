/**
 * Store de Zustand para gestión de estado global
 */
import { create } from 'zustand';

// Store de Flujos
export const useFlowStore = create((set, get) => ({
  // Estado
  flows: [],
  currentFlow: null,
  loading: false,
  error: null,

  // Acciones
  setFlows: (flows) => set({ flows }),
  
  setCurrentFlow: (flow) => set({ currentFlow: flow }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  // Agregar flujo a la lista
  addFlow: (flow) => set((state) => ({
    flows: [flow, ...state.flows]
  })),

  // Actualizar flujo en la lista
  updateFlowInList: (updatedFlow) => set((state) => ({
    flows: state.flows.map(f => f.id === updatedFlow.id ? updatedFlow : f),
    currentFlow: state.currentFlow?.id === updatedFlow.id ? updatedFlow : state.currentFlow
  })),

  // Eliminar flujo de la lista
  removeFlowFromList: (flowId) => set((state) => ({
    flows: state.flows.filter(f => f.id !== flowId),
    currentFlow: state.currentFlow?.id === flowId ? null : state.currentFlow
  })),

  // Limpiar error
  clearError: () => set({ error: null }),
}));

// Store de Workspaces
export const useWorkspaceStore = create((set) => ({
  // Estado
  workspaces: [],
  currentWorkspace: 'Default',
  loading: false,

  // Acciones
  setWorkspaces: (workspaces) => set({ workspaces }),
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  setLoading: (loading) => set({ loading }),

  // Agregar workspace
  addWorkspace: (workspace) => set((state) => ({
    workspaces: [...state.workspaces, workspace]
  })),
}));

// Store de UI
export const useUIStore = create((set) => ({
  // Estado
  sidebarOpen: true,
  viewMode: '2d', // '2d' o '3d'
  selectedNode: null,
  darkMode: false,

  // Acciones
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  toggleViewMode: () => set((state) => ({
    viewMode: state.viewMode === '2d' ? '3d' : '2d'
  })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
