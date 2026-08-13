import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const flowService = {
  createFlow: (flowData) => api.post('/flows', flowData),
  getFlow: (flowId, workspace) =>
    api.get(`/flows/${flowId}`, { params: { workspace } }),
  listFlows: (workspace) =>
    api.get('/flows', { params: { workspace } }),
  updateFlow: (flowId, flowData, workspace) =>
    api.put(`/flows/${flowId}`, flowData, { params: { workspace } }),
  deleteFlow: (flowId, workspace) =>
    api.delete(`/flows/${flowId}`, { params: { workspace } }),
  exportFlow: (flowId, workspace, format = 'tree') =>
    api.get(`/export/${flowId}`, { params: { workspace, format } }),
  listWorkspaces: () => api.get('/workspaces'),
  createWorkspace: (workspaceData) => api.post('/workspaces', workspaceData),
}

export default api
