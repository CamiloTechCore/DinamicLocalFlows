"""
DinamicLocalFlows - Backend API
Aplicación web de flujos de trabajo interactivos, modulares y enlazables
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from pathlib import Path

app = FastAPI(
    title="DinamicLocalFlows API",
    description="API para gestión de flujos de trabajo interactivos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorio de almacenamiento
DATABASE_DIR = Path(__file__).parent / "database"
FLOWS_DIR = DATABASE_DIR / "flows"
WORKSPACES_DIR = DATABASE_DIR / "workspaces"

# Asegurar que los directorios existan
FLOWS_DIR.mkdir(parents=True, exist_ok=True)
WORKSPACES_DIR.mkdir(parents=True, exist_ok=True)


# Modelos Pydantic
class NodeData(BaseModel):
    trigger: Optional[str] = None
    description: Optional[str] = None
    conditions: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None


class Node(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    label: str
    position: Dict[str, float]
    data: Optional[NodeData] = None


class EdgeData(BaseModel):
    condition: Optional[str] = None


class Edge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: str
    target: str
    data: Optional[EdgeData] = None


class FlowCreate(BaseModel):
    name: str
    description: str = ""
    workspace: str = "Default"
    nodes: List[Node] = []
    edges: List[Edge] = []


class FlowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Node]] = None
    edges: Optional[List[Edge]] = None


class WorkspaceCreate(BaseModel):
    name: str
    description: str = ""
    icon: str = "folder"


# Utilidades
def get_flow_path(flow_id: str) -> Path:
    return FLOWS_DIR / f"{flow_id}.json"


def get_workspace_path(name: str) -> Path:
    return WORKSPACES_DIR / f"{name}.json"


def load_flow(flow_id: str) -> Optional[Dict]:
    path = get_flow_path(flow_id)
    if path.exists():
        with open(path, 'r') as f:
            return json.load(f)
    return None


def save_flow(flow_data: Dict) -> None:
    path = get_flow_path(flow_data['id'])
    with open(path, 'w') as f:
        json.dump(flow_data, f, indent=2)


def delete_flow_file(flow_id: str) -> bool:
    path = get_flow_path(flow_id)
    if path.exists():
        path.unlink()
        return True
    return False


def load_all_flows(workspace: Optional[str] = None) -> List[Dict]:
    flows = []
    for file in FLOWS_DIR.glob("*.json"):
        with open(file, 'r') as f:
            flow = json.load(f)
            if workspace is None or flow.get('workspace') == workspace:
                flows.append(flow)
    return sorted(flows, key=lambda x: x.get('updatedAt', ''), reverse=True)


def save_workspace(workspace_data: Dict) -> None:
    path = get_workspace_path(workspace_data['name'])
    with open(path, 'w') as f:
        json.dump(workspace_data, f, indent=2)


def load_all_workspaces() -> List[Dict]:
    workspaces = []
    for file in WORKSPACES_DIR.glob("*.json"):
        with open(file, 'r') as f:
            workspaces.append(json.load(f))
    return sorted(workspaces, key=lambda x: x.get('name', ''))


# Endpoints de Flujos
@app.post("/api/flows", response_model=Dict)
async def create_flow(flow: FlowCreate):
    """Crear un nuevo flujo de trabajo"""
    now = datetime.utcnow().isoformat() + "Z"
    
    flow_data = {
        "id": str(uuid.uuid4()),
        "name": flow.name,
        "description": flow.description,
        "workspace": flow.workspace,
        "createdAt": now,
        "updatedAt": now,
        "nodes": [node.dict() for node in flow.nodes],
        "edges": [edge.dict() for edge in flow.edges]
    }
    
    save_flow(flow_data)
    return flow_data


@app.get("/api/flows", response_model=List[Dict])
async def list_flows(workspace: Optional[str] = None):
    """Listar todos los flujos, opcionalmente filtrados por workspace"""
    return load_all_flows(workspace)


@app.get("/api/flows/{flow_id}", response_model=Dict)
async def get_flow(flow_id: str):
    """Obtener un flujo específico por ID"""
    flow = load_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return flow


@app.put("/api/flows/{flow_id}", response_model=Dict)
async def update_flow(flow_id: str, flow_update: FlowUpdate):
    """Actualizar un flujo existente"""
    flow = load_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    # Actualizar campos
    if flow_update.name is not None:
        flow['name'] = flow_update.name
    if flow_update.description is not None:
        flow['description'] = flow_update.description
    if flow_update.nodes is not None:
        flow['nodes'] = [node.dict() for node in flow_update.nodes]
    if flow_update.edges is not None:
        flow['edges'] = [edge.dict() for edge in flow_update.edges]
    
    flow['updatedAt'] = datetime.utcnow().isoformat() + "Z"
    save_flow(flow)
    return flow


@app.delete("/api/flows/{flow_id}")
async def delete_flow(flow_id: str):
    """Eliminar un flujo"""
    if not delete_flow_file(flow_id):
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return {"message": "Flujo eliminado exitosamente"}


@app.get("/api/flows/{flow_id}/summary", response_model=Dict)
async def get_flow_summary(flow_id: str):
    """Obtener resumen estadístico del flujo"""
    flow = load_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    nodes = flow.get('nodes', [])
    edges = flow.get('edges', [])
    
    # Contar tipos de nodos
    node_types = {}
    for node in nodes:
        node_type = node.get('type', 'unknown')
        node_types[node_type] = node_types.get(node_type, 0) + 1
    
    return {
        "flow_id": flow_id,
        "name": flow['name'],
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "node_types": node_types,
        "workspace": flow.get('workspace', 'Default'),
        "created_at": flow.get('createdAt', ''),
        "updated_at": flow.get('updatedAt', '')
    }


@app.post("/api/flows/{flow_id}/duplicate", response_model=Dict)
async def duplicate_flow(flow_id: str, new_name: str = None):
    """Duplicar un flujo existente"""
    flow = load_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    now = datetime.utcnow().isoformat() + "Z"
    
    # Crear copia con nuevo ID
    new_flow = flow.copy()
    new_flow['id'] = str(uuid.uuid4())
    new_flow['name'] = new_name or f"{flow['name']} (Copia)"
    new_flow['createdAt'] = now
    new_flow['updatedAt'] = now
    
    save_flow(new_flow)
    return new_flow


# Endpoints de Workspaces
@app.post("/api/workspaces", response_model=Dict)
async def create_workspace(workspace: WorkspaceCreate):
    """Crear un nuevo workspace"""
    workspace_data = {
        "name": workspace.name,
        "description": workspace.description,
        "icon": workspace.icon,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    
    save_workspace(workspace_data)
    return workspace_data


@app.get("/api/workspaces", response_model=List[Dict])
async def list_workspaces():
    """Listar todos los workspaces"""
    return load_all_workspaces()


@app.get("/api/workspaces/{name}", response_model=Dict)
async def get_workspace(name: str):
    """Obtener un workspace específico"""
    path = get_workspace_path(name)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Workspace no encontrado")
    
    with open(path, 'r') as f:
        return json.load(f)


# Endpoints de Exportación
@app.get("/api/export/{flow_id}", response_model=Dict)
async def export_flow(flow_id: str, format: str = "tree"):
    """Exportar flujo a formato ASCII"""
    flow = load_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    ascii_art = generate_ascii(flow, format)
    return {"ascii": ascii_art}


def generate_ascii(flow: Dict, format: str = "tree") -> str:
    """Generar representación ASCII del flujo"""
    nodes = flow.get('nodes', [])
    edges = flow.get('edges', [])
    
    # Crear mapa de conexiones
    connections = {}
    for edge in edges:
        source = edge['source']
        target = edge['target']
        if source not in connections:
            connections[source] = []
        connections[source].append(target)
    
    # Encontrar nodo inicial
    all_targets = {edge['target'] for edge in edges}
    start_node = None
    for node in nodes:
        if node['id'] not in all_targets:
            start_node = node
            break
    
    if not start_node:
        start_node = nodes[0] if nodes else None
    
    if format == "tree":
        return generate_tree_ascii(start_node, connections, nodes, 0, set())
    elif format == "table":
        return generate_table_ascii(nodes, edges)
    elif format == "compact":
        return generate_compact_ascii(nodes, edges)
    else:
        return generate_tree_ascii(start_node, connections, nodes, 0, set())


def generate_tree_ascii(node: Dict, connections: Dict, all_nodes: List, 
                        depth: int, visited: set) -> str:
    """Generar árbol ASCII jerárquico"""
    if node is None or depth > 20:
        return ""
    
    if node['id'] in visited:
        return f"{'  ' * depth}└── {node['label']} (circular)\n"
    
    visited.add(node['id'])
    
    # Símbolo según tipo
    symbols = {
        'start': '●',
        'end': '■',
        'process': '□',
        'decision': '◇',
        'subflow': '▢',
        'input': '⬚',
        'output': '⬛'
    }
    symbol = symbols.get(node.get('type', ''), '○')
    
    result = f"{'  ' * depth}├── {symbol} {node['label']}\n"
    
    # Agregar hijos
    children = connections.get(node['id'], [])
    for child_id in children:
        child_node = next((n for n in all_nodes if n['id'] == child_id), None)
        if child_node:
            result += generate_tree_ascii(child_node, connections, all_nodes, depth + 1, visited.copy())
    
    return result


def generate_table_ascii(nodes: List, edges: List) -> str:
    """Generar tabla ASCII"""
    lines = []
    lines.append("┌─────┬────────────┬──────────────┬───────────┐")
    lines.append("│ ID  │ Tipo       │ Label        │ Conexiones│")
    lines.append("├─────┼────────────┼──────────────┼───────────┤")
    
    for node in nodes[:10]:  # Limitar a 10 nodos
        node_type = node.get('type', 'unknown')[:10]
        label = node.get('label', 'N/A')[:12]
        conn_count = sum(1 for e in edges if e['source'] == node['id'])
        
        lines.append(f"│ {node['id'][:5]:5} │ {node_type:10} │ {label:12} │ {conn_count:9} │")
    
    lines.append("└─────┴────────────┴──────────────┴───────────┘")
    return "\n".join(lines)


def generate_compact_ascii(nodes: List, edges: List) -> str:
    """Generar representación compacta en una línea"""
    node_labels = [n.get('label', '?') for n in nodes]
    return " → ".join(node_labels[:8]) + ("..." if len(nodes) > 8 else "")


# Endpoint de health check
@app.get("/api/health")
async def health_check():
    """Verificar estado del servidor"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
