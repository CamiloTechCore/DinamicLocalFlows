/**
 * Servicio API para comunicación con el backend
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de Flujos
export const flowService = {
  // Crear flujo
  createFlow: async (flowData) => {
    const response = await apiClient.post('/flows', flowData);
    return response.data;
  },

  // Listar flujos
  listFlows: async (workspace = null) => {
    const params = workspace ? { workspace } : {};
    const response = await apiClient.get('/flows', { params });
    return response.data;
  },

  // Obtener flujo por ID
  getFlow: async (flowId) => {
    const response = await apiClient.get(`/flows/${flowId}`);
    return response.data;
  },

  // Actualizar flujo
  updateFlow: async (flowId, flowData) => {
    const response = await apiClient.put(`/flows/${flowId}`, flowData);
    return response.data;
  },

  // Eliminar flujo
  deleteFlow: async (flowId) => {
    const response = await apiClient.delete(`/flows/${flowId}`);
    return response.data;
  },

  // Obtener resumen
  getFlowSummary: async (flowId) => {
    const response = await apiClient.get(`/flows/${flowId}/summary`);
    return response.data;
  },

  // Duplicar flujo
  duplicateFlow: async (flowId, newName = null) => {
    const params = newName ? { new_name: newName } : {};
    const response = await apiClient.post(`/flows/${flowId}/duplicate`, null, { params });
    return response.data;
  },

  // Exportar flujo a ASCII
  exportFlow: async (flowId, format = 'tree') => {
    const response = await apiClient.get(`/api/export/${flowId}`, { 
      params: { format } 
    });
    return response.data;
  },
};

// Servicios de Workspaces
export const workspaceService = {
  // Crear workspace
  createWorkspace: async (workspaceData) => {
    const response = await apiClient.post('/workspaces', workspaceData);
    return response.data;
  },

  // Listar workspaces
  listWorkspaces: async () => {
    const response = await apiClient.get('/workspaces');
    return response.data;
  },

  // Obtener workspace por nombre
  getWorkspace: async (name) => {
    const response = await apiClient.get(`/workspaces/${name}`);
    return response.data;
  },
};

// Servicio de salud del API
export const healthService = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
