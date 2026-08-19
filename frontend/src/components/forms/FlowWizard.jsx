/**
 * Componente para crear/editar flujos (Wizard)
 */
import React, { useState } from 'react';

const FlowWizard = ({ isOpen, onClose, onSave, workspaces }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace: 'Default',
    nodes: [],
    edges: [],
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flow-wizard" onClick={e => e.stopPropagation()}>
        {/* Header del Wizard */}
        <div className="wizard-header">
          <h2>Nuevo Flujo de Trabajo</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="wizard-progress">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`progress-step ${step >= s ? 'active' : ''}`}>
                <span className="step-number">{s}</span>
                <span className="step-label">
                  {s === 1 ? 'Datos Básicos' : s === 2 ? 'Nodos' : 'Conexiones'}
                </span>
              </div>
              {s < 3 && <div className={`progress-line ${step > s ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Contenido del Step */}
        <div className="wizard-body">
          {step === 1 && (
            <div className="wizard-step step-1">
              <div className="form-group">
                <label htmlFor="flow-name">Nombre del Flujo *</label>
                <input
                  id="flow-name"
                  type="text"
                  placeholder="Ej: Proceso de Aprobación"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="flow-description">Descripción</label>
                <textarea
                  id="flow-description"
                  placeholder="Describe el propósito del flujo..."
                  rows="3"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="flow-workspace">Workspace</label>
                <select
                  id="flow-workspace"
                  value={formData.workspace}
                  onChange={(e) => updateFormData('workspace', e.target.value)}
                >
                  <option value="Default">Default</option>
                  {workspaces.map(ws => (
                    <option key={ws.name} value={ws.name}>{ws.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step step-2">
              <div className="node-types-grid">
                <p className="help-text">Selecciona los tipos de nodos que necesitas:</p>
                <div className="node-type-cards">
                  {['start', 'process', 'decision', 'end', 'subflow', 'input', 'output'].map(type => (
                    <div 
                      key={type} 
                      className={`node-type-card ${formData.nodes.some(n => n.type === type) ? 'selected' : ''}`}
                      onClick={() => {
                        const newNode = {
                          id: `node-${Date.now()}`,
                          type,
                          label: type.charAt(0).toUpperCase() + type.slice(1),
                          position: { x: 100, y: 100 },
                        };
                        updateFormData('nodes', [...formData.nodes, newNode]);
                      }}
                    >
                      <div className="node-icon">{getNodeSymbol(type)}</div>
                      <span className="node-label">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formData.nodes.length > 0 && (
                <div className="nodes-list-preview">
                  <h4>Nodos agregados ({formData.nodes.length})</h4>
                  <ul>
                    {formData.nodes.map((node, idx) => (
                      <li key={node.id}>
                        <span className="node-symbol">{getNodeSymbol(node.type)}</span>
                        {node.label}
                        <button 
                          className="btn-remove-node"
                          onClick={() => {
                            updateFormData('nodes', formData.nodes.filter((_, i) => i !== idx));
                          }}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step step-3">
              <div className="connections-info">
                <p className="help-text">
                  Las conexiones se pueden definir después de crear el flujo arrastrando en el canvas.
                </p>
                <div className="summary-card">
                  <h4>Resumen del Flujo</h4>
                  <div className="summary-item">
                    <strong>Nombre:</strong> {formData.name || 'Sin nombre'}
                  </div>
                  <div className="summary-item">
                    <strong>Workspace:</strong> {formData.workspace}
                  </div>
                  <div className="summary-item">
                    <strong>Nodos:</strong> {formData.nodes.length}
                  </div>
                  <div className="summary-item">
                    <strong>Conexiones:</strong> {formData.edges.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones de navegación */}
        <div className="wizard-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Anterior
          </button>
          
          {step < 3 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={step === 1 && !formData.name.trim()}
            >
              Siguiente
            </button>
          ) : (
            <button 
              className="btn btn-success" 
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              Crear Flujo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Símbolos para cada tipo de nodo
function getNodeSymbol(type) {
  const symbols = {
    start: '●',
    end: '■',
    process: '□',
    decision: '◇',
    subflow: '▢',
    input: '⬚',
    output: '⬛',
  };
  return symbols[type] || '○';
}

export default FlowWizard;
