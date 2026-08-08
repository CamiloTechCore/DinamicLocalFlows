# 🚀 Guía de Implementación - DinamicLocalFlows

## Fase 1: Configuración Inicial del Proyecto

### Paso 1.1: Inicializar Frontend (React + Vite)

```bash
# Crear proyecto Vite con React
npm create vite@latest frontend -- --template react

cd frontend

# Instalar dependencias
npm install

# Instalar librerías específicas del proyecto
npm install axios zustand @xyflow/react react-force-graph three uuid date-fns

# Instalar herramientas de desarrollo
npm install -D tailwindcss postcss autoprefixer eslint eslint-plugin-react

# Inicializar Tailwind
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Paso 1.2: Copiar configuraciones del frontend

```bash
# Copiar vite.config.js
# Copiar tailwind.config.js
# Copiar postcss.config.js (crear si no existe)
```

**postcss.config.js:**
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Paso 1.3: Configurar estructura de carpetas

```bash
mkdir -p src/components/{layout,navigation,forms,nodes,canvas,common}
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/services
mkdir -p src/styles
```

---

## Fase 2: Configuración del Backend

### Paso 2.1: Crear entorno virtual Python

```bash
# Crear directorio backend
mkdir backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

### Paso 2.2: Instalar dependencias de FastAPI

```bash
# Crear requirements.txt
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
pytest==7.4.3
httpx==0.25.2
EOF

# Instalar dependencias
pip install -r requirements.txt
```

### Paso 2.3: Crear estructura de carpetas backend

```bash
mkdir -p app/routes
mkdir -p app/models
mkdir -p app/services
mkdir -p app/utils
mkdir database/flows
mkdir database/workspaces
```

### Paso 2.4: Crear archivos Python

```bash
# Crear archivo __init__.py en cada carpeta
touch app/__init__.py
touch app/routes/__init__.py
touch app/models/__init__.py
touch app/services/__init__.py
touch app/utils/__init__.py
```

---

## Fase 3: Implementación de Componentes Frontend

### Paso 3.1: Crear Store Global con Zustand

**src/store/flowStore.js:**
```javascript
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
```

### Paso 3.2: Crear Servicio API

**src/services/api.js:**
```javascript
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const flowService = {
  // Flujos
  createFlow: (flowData) => api.post('/flows', flowData),
  getFlow: (flowId, workspace) => 
    api.get(`/flows/${flowId}`, { params: { workspace } }),
  listFlows: (workspace) => 
    api.get('/flows', { params: { workspace } }),
  updateFlow: (flowId, flowData, workspace) => 
    api.put(`/flows/${flowId}`, flowData, { params: { workspace } }),
  deleteFlow: (flowId, workspace) => 
    api.delete(`/flows/${flowId}`, { params: { workspace } }),
  
  // Exportación
  exportFlow: (flowId, workspace) => 
    api.get(`/export/${flowId}`, { params: { workspace } }),
  
  // Workspaces
  listWorkspaces: () => api.get('/workspaces'),
  createWorkspace: (workspaceData) => api.post('/workspaces', workspaceData),
}

export default api
```

### Paso 3.3: Crear Componentes Base

**src/components/common/Button.jsx:**
```jsx
import classNames from 'classnames'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={classNames(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Paso 3.4: Crear Layout Principal

**src/components/layout/MainLayout.jsx:**
```jsx
export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      {/* Fondo elegante */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
```

---

## Fase 4: Integración de React Flow (Canvas 2D)

### Paso 4.1: Crear Canvas2D

**src/components/canvas/Canvas2D.jsx:**
```jsx
import { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer'
import { useFlowStore } from '@store/flowStore'
import StartNode from '@components/nodes/StartNode'
import EndNode from '@components/nodes/EndNode'
import ProcessNode from '@components/nodes/ProcessNode'
import DecisionNode from '@components/nodes/DecisionNode'

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
}

export function Canvas2D() {
  const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges } = useFlowStore()
  const [nodes, setNodesState] = useNodesState(storeNodes)
  const [edges, setEdgesState] = useEdgesState(storeEdges)

  const onConnect = useCallback(
    (connection) => {
      const newEdges = addEdge(connection, edges)
      setEdgesState(newEdges)
      setEdges(newEdges)
    },
    [edges, setEdgesState, setEdges]
  )

  const onNodesChange = useCallback(
    (changes) => {
      setNodesState(changes)
      // Sincronizar con store
    },
    [setNodesState]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
```

### Paso 4.2: Crear Nodos Personalizados

**src/components/nodes/StartNode.jsx:**
```jsx
import { Handle, Position } from 'react-flow-renderer'

export default function StartNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-full bg-green-500 text-white font-bold border-2 border-green-600">
      {data.label || 'Inicio'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

**src/components/nodes/EndNode.jsx:**
```jsx
import { Handle, Position } from 'react-flow-renderer'

export default function EndNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-full bg-red-500 text-white font-bold border-2 border-red-600">
      {data.label || 'Fin'}
      <Handle type="target" position={Position.Top} />
    </div>
  )
}
```

**src/components/nodes/ProcessNode.jsx:**
```jsx
import { Handle, Position } from 'react-flow-renderer'

export default function ProcessNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-blue-500 text-white font-semibold border-2 border-blue-600">
      {data.label || 'Proceso'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

**src/components/nodes/DecisionNode.jsx:**
```jsx
import { Handle, Position } from 'react-flow-renderer'

export default function DecisionNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-sm bg-yellow-500 text-black font-bold border-2 border-yellow-600"
         style={{ transform: 'rotate(45deg)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {data.label || '?'}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
```

---

## Fase 5: Integración de Exportación ASCII

### Paso 5.1: Crear Ruta de Exportación en Backend

**app/routes/export.py:**
```python
from fastapi import APIRouter, HTTPException, Query
from app.services.export_service import export_service
from app.services.file_manager import file_manager
from app.models.flow import ExportResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{flow_id}", response_model=ExportResponse)
async def export_flow_ascii(
    flow_id: str,
    workspace: Optional[str] = Query(None),
    format: str = Query("tree", regex="^(tree|table|compact)$")
):
    """
    Exportar un flujo a formato ASCII
    
    Formatos disponibles:
    - tree: Árbol ASCII jerárquico
    - table: Tabla ASCII
    - compact: Una línea compacta
    """
    try:
        flow = file_manager.get_flow(flow_id, workspace)
        if not flow:
            raise HTTPException(status_code=404, detail="Flujo no encontrado")
        
        if format == "table":
            ascii_art = export_service.export_flow_table(flow)
        elif format == "compact":
            ascii_art = export_service.export_flow_compact(flow)
        else:
            ascii_art = export_service.export_flow(flow)
        
        return ExportResponse(
            success=True,
            flowId=flow_id,
            flowName=flow['name'],
            ascii=ascii_art
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exportando: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
```

---

## Fase 6: Crear Archivo de Inicio

### Paso 6.1: Backend - run.py

**backend/run.py:**
```python
import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Crear directorios
    Path("database/flows").mkdir(parents=True, exist_ok=True)
    Path("database/workspaces").mkdir(parents=True, exist_ok=True)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
```

### Paso 6.2: Frontend - App.jsx

**src/App.jsx:**
```jsx
import { useEffect } from 'react'
import { MainLayout } from '@components/layout/MainLayout'
import { Canvas2D } from '@components/canvas/Canvas2D'
import { FlowWizard } from '@components/forms/FlowWizard'
import { Sidebar } from '@components/navigation/Sidebar'
import { useFlowStore } from '@store/flowStore'

function App() {
  const flowStore = useFlowStore()

  return (
    <MainLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Área Principal */}
        <main className="flex-1 flex flex-col">
          {/* Wizard para crear flujos */}
          <FlowWizard />
          
          {/* Canvas */}
          <div className="flex-1">
            <Canvas2D />
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

export default App
```

---

## Checklist de Implementación

### Frontend
- [ ] Proyecto Vite + React inicializado
- [ ] Tailwind CSS configurado
- [ ] Store Zustand creado
- [ ] Componentes base implementados
- [ ] Canvas 2D (React Flow) integrado
- [ ] Nodos personalizados creados
- [ ] Formulario Wizard implementado
- [ ] Servicio API configurado
- [ ] Canvas 3D (Force Graph) integrado
- [ ] Toggle 2D/3D funcionando

### Backend
- [ ] FastAPI inicializado
- [ ] Modelos Pydantic definidos
- [ ] File Manager implementado
- [ ] Rutas CRUD creadas
- [ ] Sistema de Workspaces funcionando
- [ ] Exportación ASCII implementada
- [ ] CORS configurado
- [ ] Validación de datos completa
- [ ] Manejo de errores implementado
- [ ] Tests básicos creados

---

## Comandos de Desarrollo

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev
# Acceder en: http://localhost:5173

# Terminal 2 - Backend
cd backend
source venv/bin/activate  # macOS/Linux
# o venv\Scripts\activate  # Windows
python run.py
# API disponible en: http://localhost:8000/api/docs
```

---

## Próximos Pasos

1. **Implementar Wizard de Flujos**: Formulario interactivo para crear flujos paso a paso
2. **Integrar Canvas 3D**: Añadir visualización tridimensional con react-force-graph
3. **Sistema de Sub-flujos**: Permitir flujos anidados
4. **Persistencia avanzada**: Historial de cambios y versionado
5. **Autenticación**: Sistema de usuarios (opcional para uso local)
6. **Testing**: Unit tests y E2E tests
7. **Optimización**: Performance y caching