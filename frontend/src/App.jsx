/**
 * DinamicLocalFlows - Aplicación Principal
 * Editor visual de flujos de trabajo con vistas 2D/3D
 */
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import FlowCanvas2D from './components/canvas/FlowCanvas2D';
import FlowCanvas3D from './components/canvas/FlowCanvas3D';
import FlowWizard from './components/forms/FlowWizard';
import { useFlowStore, useWorkspaceStore, useUIStore } from './store';
import { flowService, workspaceService } from './services/api';
import './App.css';

function App() {
  // Estados globales desde Zustand
  const { 
    flows, setFlows, addFlow, updateFlowInList, removeFlowFromList,
    currentFlow, setCurrentFlow, loading, setLoading, error, setError 
  } = useFlowStore();
  
  const { 
    workspaces, setWorkspaces, currentWorkspace, setCurrentWorkspace 
  } = useWorkspaceStore();
  
  const { 
    sidebarOpen, toggleSidebar, viewMode, toggleViewMode 
  } = useUIStore();

  // Estado local
  const [wizardOpen, setWizardOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadWorkspaces();
    loadFlows();
  }, []);

  // Cargar flujos cuando cambia el workspace
  useEffect(() => {
    if (workspaces.length > 0) {
      loadFlows();
    }
  }, [currentWorkspace]);

  // Cargar workspaces
  const loadWorkspaces = async () => {
    try {
      const data = await workspaceService.listWorkspaces();
      if (data.length === 0) {
        // Crear workspace por defecto
        const defaultWorkspace = await workspaceService.createWorkspace({
          name: 'Default',
          description: 'Workspace por defecto',
          icon: 'folder'
        });
        setWorkspaces([defaultWorkspace]);
      } else {
        setWorkspaces(data);
      }
    } catch (err) {
      console.error('Error cargando workspaces:', err);
      // Workspace por defecto en caso de error
      setWorkspaces([{ name: 'Default', description: 'Default workspace', icon: 'folder' }]);
    }
  };

  // Cargar flujos
  const loadFlows = async () => {
    setLoading(true);
    try {
      const workspaceFilter = currentWorkspace !== 'all' ? currentWorkspace : null;
      const data = await flowService.listFlows(workspaceFilter);
      setFlows(data);
    } catch (err) {
      console.error('Error cargando flujos:', err);
      setError('No se pudieron cargar los flujos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación de flujo
  const handleNewFlow = () => {
    setWizardOpen(true);
  };

  const handleSaveFlow = async (flowData) => {
    try {
      const newFlow = await flowService.createFlow(flowData);
      addFlow(newFlow);
      setCurrentFlow(newFlow);
    } catch (err) {
      console.error('Error creando flujo:', err);
      setError('No se pudo crear el flujo');
    }
  };

  // Manejar selección de flujo
  const handleSelectFlow = async (flow) => {
    try {
      const fullFlow = await flowService.getFlow(flow.id);
      setCurrentFlow(fullFlow);
    } catch (err) {
      console.error('Error cargando flujo:', err);
      setCurrentFlow(flow);
    }
  };

  // Manejar cambio de workspace
  const handleWorkspaceChange = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        onViewModeToggle={toggleViewMode}
        viewMode={viewMode}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          flows={flows}
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          onNewFlow={handleNewFlow}
          onSelectFlow={handleSelectFlow}
          onWorkspaceChange={handleWorkspaceChange}
        />

        {/* Canvas Area */}
        <section className="canvas-area">
          {currentFlow ? (
            <>
              <div className="canvas-header">
                <h2>{currentFlow.name}</h2>
                <p className="canvas-subtitle">{currentFlow.description}</p>
              </div>
              
              {viewMode === '2d' ? (
                <FlowCanvas2D 
                  initialNodes={currentFlow.nodes || []}
                  initialEdges={currentFlow.edges || []}
                />
              ) : (
                <FlowCanvas3D 
                  nodes={currentFlow.nodes || []}
                  edges={currentFlow.edges || []}
                />
              )}
            </>
          ) : (
            <div className="empty-canvas">
              <div className="empty-canvas-content">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                  <line x1="9" y1="3" x2="9" y2="9"/>
                  <line x1="15" y1="3" x2="15" y2="9"/>
                  <line x1="9" y1="15" x2="9" y2="21"/>
                  <line x1="15" y1="15" x2="15" y2="21"/>
                  <line x1="3" y1="9" x2="9" y2="9"/>
                  <line x1="3" y1="15" x2="9" y2="15"/>
                  <line x1="15" y1="9" x2="21" y2="9"/>
                  <line x1="15" y1="15" x2="21" y2="15"/>
                </svg>
                <h2>Bienvenido a DinamicLocalFlows</h2>
                <p>Selecciona un flujo del panel lateral o crea uno nuevo para comenzar</p>
                <button className="btn btn-primary btn-large" onClick={handleNewFlow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Crear Nuevo Flujo
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Wizard Modal */}
      <FlowWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSave={handleSaveFlow}
        workspaces={workspaces}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;
