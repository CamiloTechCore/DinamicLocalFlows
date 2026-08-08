# 🏗️ DinamicLocalFlows - Guía de Arquitectura Completa

## 📋 Visión General

**DinamicLocalFlows** es una aplicación web de flujos de trabajo interactivos que permite:
- Diseñar diagramas complejos en modo 2D (React Flow) y 3D (Force Graph)
- Guardar flujos en JSON local con referencias a sub-flujos
- Exportar diagramas a formato ASCII
- Gestionar grupos de trabajo y proyectos

---

## 📁 Estructura de Carpetas Completa

```
DinamicLocalFlows/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Componentes de estructura
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── navigation/          # Navegación y menús
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── NavBar.jsx
│   │   │   │   └── WorkspaceSelector.jsx
│   │   │   │
│   │   │   ├── forms/               # Formularios wizard
│   │   │   │   ├── FlowWizard.jsx
│   │   │   │   ├── BasicDataStep.jsx
│   │   │   │   ├── NodesStep.jsx
│   │   │   │   ├── DecisionsStep.jsx
│   │   │   │   └── wizardStore.js
│   │   │   │
│   │   │   ├── nodes/               # Nodos personalizados
│   │   │   │   ├── StartNode.jsx
│   │   │   │   ├── EndNode.jsx
│   │   │   │   ├── DecisionNode.jsx
│   │   │   │   ├── ProcessNode.jsx
│   │   │   │   ├── SubFlowNode.jsx
│   │   │   │   └── nodeRegistry.js
│   │   │   │
│   │   │   ├── canvas/              # Lienzo principal
│   │   │   │   ├── FlowCanvas.jsx
│   │   │   │   ├── Canvas2D.jsx     # React Flow
│   │   │   │   ├── Canvas3D.jsx     # Force Graph
│   │   │   │   ├── ViewToggle.jsx
│   │   │   │   └── canvasUtils.js
│   │   │   │
│   │   │   └── common/              # Componentes reutilizables
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Spinner.jsx
│   │   │       └── Toast.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useFlowStore.js
│   │   │   ├── useApi.js
│   │   │   └── useToggle.js
│   │   │
│   │   ├── store/
│   │   │   ├── flowStore.js         # Zustand store global
│   │   │   └── workspaceStore.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Llamadas a backend
│   │   │   ├── flowService.js
│   │   │   └── exportService.js
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── glassmorphism.css
│   │   │   └── animations.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # Punto de entrada FastAPI
│   │   ├── config.py                # Configuración global
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── flow.py              # Modelos Pydantic
│   │   │   ├── node.py
│   │   │   └── workspace.py
│   │   │
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── flows.py             # CRUD de flujos
│   │   │   ├── workspaces.py        # Gestión de grupos
│   │   │   ├── export.py            # Exportación ASCII
│   │   │   └── health.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── file_manager.py      # Manejo de archivos JSON
│   │   │   ├── flow_processor.py    # Lógica de flujos
│   │   │   ├── export_service.py    # Generador ASCII
│   │   │   └── validation.py
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── uuid_generator.py
│   │   │   └── path_utils.py
│   │   │
│   │   └── database/                # ⚠️ Esta es LOCAL (no en git)
│   │       ├── flows/
│   │       └── workspaces/
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py

└── README.md
```

---

## 🎯 Stack Tecnológico

### Frontend
| Librería | Propósito | Versión |
|----------|-----------|---------|
| React | UI Framework | 18.x |
| Vite | Build Tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| React Flow | Canvas 2D | 11.x |
| React Force Graph | Canvas 3D | 1.x |
| Zustand | State Management | 4.x |
| Axios | HTTP Client | 1.x |

### Backend
| Librería | Propósito | Versión |
|----------|-----------|---------|
| FastAPI | Web Framework | 0.100.x |
| Pydantic | Validation | 2.x |
| Python-multipart | File Upload | 0.0.6 |
| UUID | ID Generation | - |

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FlowWizard: Wizard de 3 pasos                        │   │
│  │ 1. Datos básicos (nombre, descripción, grupo)       │   │
│  │ 2. Nodos (agregar inicio, proceso, fin, decisión)   │   │
│  │ 3. Decisiones (definir condiciones y ramificaciones)│   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Canvas (2D o 3D):                                    │   │
│  │ - React Flow para vista 2D                          │   │
│  │ - Force Graph para vista 3D                         │   │
│  │ - Toggle para cambiar entre vistas                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓ (Zustand Store)
┌─────────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT (Zustand)                      │
│  - flowStore: { nodes, edges, metadata, currentWorkspace } │
└─────────────────────────────────────────────────────────────┘
                          ↓ (Axios/HTTP)
┌─────────────────────────────────────────────────────────────┐
│                  REST API (FastAPI)                          │
│  POST   /api/flows                 → Crear nuevo flujo      │
│  GET    /api/flows/{id}            → Obtener flujo          │
│  PUT    /api/flows/{id}            → Actualizar flujo       │
│  DELETE /api/flows/{id}            → Eliminar flujo         │
│  GET    /api/flows/{id}/export     → Exportar ASCII         │
│  POST   /api/workspaces            → Crear grupo            │
└─────────────────────────────────────────────────────────────┘
                          ↓ (File System)
┌─────────────────────────────────────────────────────────────┐
│             LOCAL FILE SYSTEM (JSON Storage)                │
│  database/                                                   │
│  ├── flows/                                                  │
│  │   └── FlowName_UUID.json                                │
│  │       {                                                   │
│  │         "id": "UUID",                                    │
│  │         "name": "FlowName",                              │
│  │         "workspace": "optional_group",                   │
│  │         "nodes": [                                       │
│  │           { "id": "node1", "type": "start", ... },      │
│  │           { "id": "node2", "type": "process", ... },    │
│  │           { "id": "node3", "type": "subflow",           │
│  │             "reference": "OtherFlow_UUID.json" }        │
│  │         ],                                               │
│  │         "edges": [ ... ]                                │
│  │       }                                                   │
│  └── workspaces/                                             │
│      └── WorkspaceName.json                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Esquema JSON del Flujo

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Proceso de Aprobación",
  "description": "Flujo de aprobación de compras",
  "version": "1.0.0",
  "workspace": "Finanzas",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:45:00Z",
  "nodes": [
    {
      "id": "node-1",
      "type": "start",
      "label": "Inicio",
      "position": { "x": 0, "y": 0 },
      "data": {
        "trigger": "manual"
      }
    },
    {
      "id": "node-2",
      "type": "process",
      "label": "Validar Monto",
      "position": { "x": 200, "y": 0 },
      "data": {
        "description": "Verificar que el monto sea válido",
        "outputs": ["válido", "inválido"]
      }
    },
    {
      "id": "node-3",
      "type": "decision",
      "label": "¿Monto > 1000?",
      "position": { "x": 400, "y": 0 },
      "data": {
        "conditions": [
          { "label": "Sí", "value": "yes" },
          { "label": "No", "value": "no" }
        ]
      }
    },
    {
      "id": "node-4",
      "type": "subflow",
      "label": "Aprobación Gerente",
      "position": { "x": 600, "y": -150 },
      "data": {
        "reference": "AprobacionGerente_UUID.json"
      }
    },
    {
      "id": "node-5",
      "type": "end",
      "label": "Fin",
      "position": { "x": 800, "y": 0 },
      "data": {
        "status": "completed"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1-2",
      "source": "node-1",
      "target": "node-2"
    },
    {
      "id": "edge-2-3",
      "source": "node-2",
      "target": "node-3"
    },
    {
      "id": "edge-3-4",
      "source": "node-3",
      "target": "node-4",
      "data": { "condition": "yes" }
    },
    {
      "id": "edge-3-5",
      "source": "node-3",
      "target": "node-5",
      "data": { "condition": "no" }
    },
    {
      "id": "edge-4-5",
      "source": "node-4",
      "target": "node-5"
    }
  ]
}
```

---

## 🚀 Fases de Implementación

### Fase 1: Configuración Base ⚡ (Semana 1)
- [ ] Inicializar proyecto Vite + React
- [ ] Configurar Tailwind CSS
- [ ] Crear estructura de carpetas
- [ ] Inicializar FastAPI backend
- [ ] Configurar CORS y conexión frontend-backend

### Fase 2: Frontend - Componentes Básicos 🎨 (Semana 2)
- [ ] Crear Layout principal con glassmorphism
- [ ] Implementar componentes base (Button, Modal, etc)
- [ ] Diseñar Wizard para crear flujos
- [ ] Configurar Zustand store

### Fase 3: Canvas 2D y Nodos 🎯 (Semana 3)
- [ ] Integrar React Flow
- [ ] Crear nodos personalizados (Start, End, Decision, Process)
- [ ] Implementar lógica de conexiones
- [ ] Manejo de arrastrar y soltar

### Fase 4: Backend - CRUD y Archivo 💾 (Semana 2-3)
- [ ] Crear modelos Pydantic
- [ ] Implementar endpoints CRUD
- [ ] Sistema de gestión de archivos JSON
- [ ] Validación de datos

### Fase 5: Canvas 3D y Toggle 🎪 (Semana 4)
- [ ] Integrar react-force-graph
- [ ] Crear componente Canvas3D
- [ ] Implementar toggle 2D/3D
- [ ] Optimizar renderizado

### Fase 6: Exportación e Integraciones ✨ (Semana 4-5)
- [ ] Generar ASCII art del diagrama
- [ ] Endpoint de exportación
- [ ] Sistema de sub-flujos
- [ ] Testing completo

---

## 🔐 Consideraciones de Seguridad

1. **Validación de entrada**: Todas las requests pasarán por Pydantic
2. **Sanitización de nombres**: Los nombres de archivos se procesarán para evitar path traversal
3. **CORS configurado**: Solo desde localhost en desarrollo
4. **Sin API Key requerida**: La app es local, pero mantener seguridad por defecto
5. **Manejo de errores**: Respuestas HTTP apropiadas para todos los casos

---

## 📊 Métricas de Éxito

- ✅ Crear, guardar y cargar flujos en < 500ms
- ✅ Renderizar diagramas con 100+ nodos sin lag
- ✅ Toggle 2D/3D en < 200ms
- ✅ Exportación ASCII en < 1s
- ✅ Aplicación responsive en mobile

---

## 🛠️ Comandos de Desarrollo

```bash
# Frontend
npm install
npm run dev

# Backend
pip install -r requirements.txt
python run.py
```

---

## 📚 Recursos y Referencias

- [React Flow Docs](https://reactflow.dev/)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand Documentation](https://zustand-demo.vercel.app/)