/**
 * Componente Sidebar para navegación y lista de flujos
 */
import React from 'react';

const Sidebar = ({ 
  isOpen, 
  flows, 
  workspaces, 
  currentWorkspace, 
  onNewFlow, 
  onSelectFlow, 
  onWorkspaceChange 
}) => {
  if (!isOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Flujos</h2>
        <button 
          className="btn-new-flow"
          onClick={onNewFlow}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Flujo
        </button>
      </div>

      {/* Filtro por Workspace */}
      <div className="workspace-filter">
        <label htmlFor="workspace-select">Workspace:</label>
        <select 
          id="workspace-select"
          value={currentWorkspace}
          onChange={(e) => onWorkspaceChange(e.target.value)}
        >
          <option value="all">Todos</option>
          {workspaces.map(ws => (
            <option key={ws.name} value={ws.name}>{ws.name}</option>
          ))}
        </select>
      </div>

      {/* Lista de Flujos */}
      <div className="flows-list">
        {flows.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No hay flujos creados</p>
            <button onClick={onNewFlow} className="btn-create-first">
              Crear primer flujo
            </button>
          </div>
        ) : (
          flows.map(flow => (
            <div 
              key={flow.id} 
              className="flow-item"
              onClick={() => onSelectFlow(flow)}
            >
              <div className="flow-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="flow-info">
                <h3>{flow.name}</h3>
                <p>{flow.description || 'Sin descripción'}</p>
                <span className="flow-workspace">{flow.workspace}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer del Sidebar */}
      <div className="sidebar-footer">
        <div className="stats">
          <span>{flows.length} flujo(s)</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
