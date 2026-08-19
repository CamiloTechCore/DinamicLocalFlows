
Frontend vite.config · JS
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
})

---------------

Frontend tailwind.config · JS
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#082f49',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-lg': '0 0 40px rgba(14, 165, 233, 0.4)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-glass'),
  ],
}

-----------------------------

Frontend package · JSON
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "@xyflow/react": "^12.11.2",
    "axios": "^1.19.0",
    "date-fns": "^4.4.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-force-graph": "^1.48.2",
    "three": "^0.185.1",
    "uuid": "^14.0.1",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "autoprefixer": "^10.5.4",
    "eslint": "^9.39.5",
    "eslint-plugin-react": "^7.37.5",
    "oxlint": "^1.75.0",
    "postcss": "^8.5.26",
    "tailwindcss": "^3.4.19",
    "vite": "^8.2.0"
  }
}
-----------------------

"""
FastAPI Backend - DinamicLocalFlows
Punto de entrada principal de la aplicación
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging

# Importar rutas
from app.routes import flows, workspaces, export, health

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# LIFESPAN EVENTS
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Eventos de inicialización y shutdown de la aplicación
    """
    # Startup
    logger.info("🚀 Iniciando DinamicLocalFlows Backend...")
    
    # Crear directorios de base de datos si no existen
    os.makedirs('database/flows', exist_ok=True)
    os.makedirs('database/workspaces', exist_ok=True)
    logger.info("✅ Directorios de base de datos inicializados")
    
    yield
    
    # Shutdown
    logger.info("🛑 Deteniendo DinamicLocalFlows Backend...")


# ============================================================================
# APLICACIÓN FASTAPI
# ============================================================================

app = FastAPI(
    title="DinamicLocalFlows API",
    description="API local para gestión de diagramas de flujo interactivos",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# ============================================================================
# MIDDLEWARE
# ============================================================================

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# RUTAS
# ============================================================================

# Health check
@app.get("/health", tags=["System"])
async def health_check():
    """Verificar estado del servidor"""
    return {
        "status": "healthy",
        "service": "DinamicLocalFlows",
        "version": "0.1.0"
    }

# Incluir routers
app.include_router(
    health.router,
    prefix="/api",
    tags=["Health"]
)

app.include_router(
    flows.router,
    prefix="/api/flows",
    tags=["Flows"]
)

app.include_router(
    workspaces.router,
    prefix="/api/workspaces",
    tags=["Workspaces"]
)

app.include_router(
    export.router,
    prefix="/api/export",
    tags=["Export"]
)

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Manejo personalizado de excepciones HTTP"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Manejo personalizado de excepciones generales"""
    logger.error(f"Error no manejado: {str(exc)}")
    return {
        "error": "Error interno del servidor",
        "status_code": 500
    }

# ============================================================================
# RUTAS RAÍZ
# ============================================================================

@app.get("/", tags=["Root"])
async def root():
    """Ruta raíz de la API"""
    return {
        "message": "Bienvenido a DinamicLocalFlows API",
        "docs": "/api/docs",
        "openapi": "/api/openapi.json"
    }

@app.get("/api", tags=["Root"])
async def api_root():
    """Punto de entrada de la API"""
    return {
        "message": "DinamicLocalFlows API v0.1.0",
        "endpoints": {
            "flows": "/api/flows",
            "workspaces": "/api/workspaces",
            "export": "/api/export",
            "docs": "/api/docs"
        }
    }

# ============================================================================
# PUNTO DE ENTRADA
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

    ----------------------------

    """
Modelos Pydantic para validación de datos
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================

class NodeType(str, Enum):
    """Tipos de nodos soportados"""
    START = "start"
    END = "end"
    PROCESS = "process"
    DECISION = "decision"
    SUBFLOW = "subflow"
    INPUT = "input"
    OUTPUT = "output"


class EdgeType(str, Enum):
    """Tipos de conexiones"""
    DEFAULT = "default"
    CONDITIONAL = "conditional"
    LOOP = "loop"


# ============================================================================
# MODELOS DE NODOS Y CONEXIONES
# ============================================================================

class Position(BaseModel):
    """Posición en el canvas"""
    x: float
    y: float


class NodeData(BaseModel):
    """Datos asociados a un nodo"""
    description: Optional[str] = None
    trigger: Optional[str] = None  # Para nodos START
    status: Optional[str] = None   # Para nodos END
    reference: Optional[str] = None  # Para nodos SUBFLOW
    conditions: Optional[List[Dict[str, str]]] = None  # Para decisiones
    outputs: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = {}


class Node(BaseModel):
    """Modelo de un nodo en el flujo"""
    id: str = Field(..., description="ID único del nodo")
    type: NodeType = Field(..., description="Tipo de nodo")
    label: str = Field(..., description="Etiqueta visible del nodo")
    position: Position = Field(..., description="Posición en canvas")
    data: NodeData = Field(default_factory=NodeData)
    style: Optional[Dict[str, Any]] = None
    

class Edge(BaseModel):
    """Modelo de una conexión entre nodos"""
    id: str = Field(..., description="ID único de la conexión")
    source: str = Field(..., description="ID del nodo origen")
    target: str = Field(..., description="ID del nodo destino")
    type: EdgeType = Field(default=EdgeType.DEFAULT)
    data: Optional[Dict[str, Any]] = None
    animated: Optional[bool] = False
    

# ============================================================================
# MODELOS DE FLUJOS
# ============================================================================

class FlowCreate(BaseModel):
    """Modelo para crear un nuevo flujo"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    workspace: Optional[str] = Field(None, description="Grupo/Workspace al que pertenece")
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    
    @validator('name')
    def name_must_be_alphanumeric(cls, v):
        if not v.replace(' ', '').replace('_', '').isalnum():
            raise ValueError('El nombre debe contener solo letras, números, espacios y guiones bajos')
        return v


class FlowUpdate(BaseModel):
    """Modelo para actualizar un flujo existente"""
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Node]] = None
    edges: Optional[List[Edge]] = None


class Flow(BaseModel):
    """Modelo completo de un flujo con metadata"""
    id: str
    name: str
    description: Optional[str]
    version: str = "1.0.0"
    workspace: Optional[str]
    createdAt: datetime
    updatedAt: datetime
    nodes: List[Node]
    edges: List[Edge]
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "Proceso de Aprobación",
                "description": "Flujo de aprobación de compras",
                "version": "1.0.0",
                "workspace": "Finanzas",
                "createdAt": "2024-01-15T10:30:00Z",
                "updatedAt": "2024-01-15T14:45:00Z",
                "nodes": [],
                "edges": []
            }
        }


# ============================================================================
# MODELOS DE WORKSPACES
# ============================================================================

class WorkspaceCreate(BaseModel):
    """Modelo para crear un workspace/grupo"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = None


class Workspace(BaseModel):
    """Modelo completo de un workspace"""
    name: str
    description: Optional[str]
    icon: Optional[str]
    createdAt: datetime
    flowCount: int = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Finanzas",
                "description": "Procesos relacionados con finanzas",
                "icon": "💰",
                "createdAt": "2024-01-15T10:30:00Z",
                "flowCount": 5
            }
        }


# ============================================================================
# MODELOS DE RESPUESTA
# ============================================================================

class FlowResponse(BaseModel):
    """Respuesta estándar para operaciones con flujos"""
    success: bool
    message: str
    data: Optional[Flow] = None
    error: Optional[str] = None


class FlowListResponse(BaseModel):
    """Respuesta para listar flujos"""
    success: bool
    data: List[Flow]
    count: int
    workspace: Optional[str] = None


class ExportResponse(BaseModel):
    """Respuesta para exportación ASCII"""
    success: bool
    flowId: str
    flowName: str
    ascii: str
    mimeType: str = "text/plain"


class WorkspaceListResponse(BaseModel):
    """Respuesta para listar workspaces"""
    success: bool
    data: List[Workspace]
    count: int


# ============================================================================
# MODELOS DE ERROR
# ============================================================================

class ErrorDetail(BaseModel):
    """Detalle de error"""
    error: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    path: Optional[str] = None


class ValidationError(ErrorDetail):
    """Error de validación"""
    details: List[Dict[str, Any]] = []




    ----------------------------------------------


    """
Servicio de Gestión de Archivos JSON
Maneja la lectura, escritura y organización de flujos en el sistema de archivos local
"""

import json
import os
import uuid
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class FileManager:
    """Gestor de archivos JSON para flujos y workspaces"""
    
    BASE_PATH = Path("database")
    FLOWS_PATH = BASE_PATH / "flows"
    WORKSPACES_PATH = BASE_PATH / "workspaces"
    
    def __init__(self):
        """Inicializar el gestor de archivos"""
        self._ensure_directories()
    
    @staticmethod
    def _ensure_directories():
        """Crear directorios necesarios si no existen"""
        FileManager.FLOWS_PATH.mkdir(parents=True, exist_ok=True)
        FileManager.WORKSPACES_PATH.mkdir(parents=True, exist_ok=True)
        logger.info(f"Directorios inicializados: {FileManager.FLOWS_PATH}, {FileManager.WORKSPACES_PATH}")
    
    @staticmethod
    def _generate_filename(name: str, file_id: Optional[str] = None) -> str:
        """
        Generar nombre de archivo único
        Formato: NombreProceso_UUID.json
        """
        if file_id is None:
            file_id = str(uuid.uuid4())
        
        # Sanitizar nombre: solo letras, números y guiones bajos
        clean_name = "".join(c if c.isalnum() or c in ['_', '-'] else '_' for c in name)
        clean_name = clean_name[:50]  # Limitar longitud
        
        return f"{clean_name}_{file_id}.json"
    
    @staticmethod
    def _get_flow_path(filename: str, workspace: Optional[str] = None) -> Path:
        """
        Obtener ruta completa de un archivo de flujo
        Si tiene workspace, se crea subcarpeta
        """
        if workspace:
            workspace_path = FileManager.FLOWS_PATH / workspace
            workspace_path.mkdir(parents=True, exist_ok=True)
            return workspace_path / filename
        else:
            return FileManager.FLOWS_PATH / filename
    
    # ========================================================================
    # OPERACIONES DE FLUJOS
    # ========================================================================
    
    @staticmethod
    def save_flow(flow_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Guardar un flujo en archivo JSON
        
        Args:
            flow_data: Diccionario con datos del flujo
            
        Returns:
            Diccionario con información de guardado
        """
        try:
            flow_id = flow_data.get('id') or str(uuid.uuid4())
            flow_data['id'] = flow_id
            
            # Agregar timestamps
            now = datetime.utcnow().isoformat()
            flow_data['createdAt'] = flow_data.get('createdAt', now)
            flow_data['updatedAt'] = now
            
            # Generar nombre de archivo
            filename = FileManager._generate_filename(flow_data['name'], flow_id)
            
            # Obtener ruta (con workspace si aplica)
            workspace = flow_data.get('workspace')
            filepath = FileManager._get_flow_path(filename, workspace)
            
            # Guardar archivo
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(flow_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Flujo guardado: {filepath}")
            
            return {
                "success": True,
                "id": flow_id,
                "filepath": str(filepath),
                "filename": filename
            }
        
        except Exception as e:
            logger.error(f"❌ Error guardando flujo: {str(e)}")
            raise
    
    @staticmethod
    def get_flow(flow_id: str, workspace: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Obtener un flujo por ID
        
        Args:
            flow_id: ID del flujo
            workspace: Workspace opcional
            
        Returns:
            Diccionario del flujo o None si no existe
        """
        try:
            # Buscar en la carpeta especificada
            search_path = FileManager.FLOWS_PATH / workspace if workspace else FileManager.FLOWS_PATH
            
            if not search_path.exists():
                return None
            
            # Buscar archivo con el ID
            for filepath in search_path.glob(f"*_{flow_id}.json"):
                with open(filepath, 'r', encoding='utf-8') as f:
                    return json.load(f)
            
            logger.warning(f"Flujo no encontrado: {flow_id}")
            return None
        
        except Exception as e:
            logger.error(f"❌ Error leyendo flujo: {str(e)}")
            raise
    
    @staticmethod
    def update_flow(flow_id: str, flow_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Actualizar un flujo existente
        
        Args:
            flow_id: ID del flujo a actualizar
            flow_data: Nuevos datos del flujo
            
        Returns:
            Información de actualización
        """
        try:
            workspace = flow_data.get('workspace')
            
            # Obtener flujo actual
            current_flow = FileManager.get_flow(flow_id, workspace)
            if not current_flow:
                raise ValueError(f"Flujo {flow_id} no encontrado")
            
            # Actualizar datos
            current_flow.update(flow_data)
            current_flow['id'] = flow_id
            current_flow['updatedAt'] = datetime.utcnow().isoformat()
            
            # Guardar archivo actualizado
            filename = FileManager._generate_filename(current_flow['name'], flow_id)
            filepath = FileManager._get_flow_path(filename, workspace)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(current_flow, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Flujo actualizado: {filepath}")
            
            return {
                "success": True,
                "id": flow_id,
                "message": "Flujo actualizado correctamente"
            }
        
        except Exception as e:
            logger.error(f"❌ Error actualizando flujo: {str(e)}")
            raise
    
    @staticmethod
    def delete_flow(flow_id: str, workspace: Optional[str] = None) -> Dict[str, Any]:
        """
        Eliminar un flujo
        
        Args:
            flow_id: ID del flujo a eliminar
            workspace: Workspace opcional
            
        Returns:
            Información de eliminación
        """
        try:
            search_path = FileManager.FLOWS_PATH / workspace if workspace else FileManager.FLOWS_PATH
            
            # Buscar y eliminar archivo
            for filepath in search_path.glob(f"*_{flow_id}.json"):
                filepath.unlink()
                logger.info(f"✅ Flujo eliminado: {filepath}")
                
                return {
                    "success": True,
                    "id": flow_id,
                    "message": "Flujo eliminado correctamente"
                }
            
            raise ValueError(f"Flujo {flow_id} no encontrado")
        
        except Exception as e:
            logger.error(f"❌ Error eliminando flujo: {str(e)}")
            raise
    
    @staticmethod
    def list_flows(workspace: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Listar todos los flujos (opcionalmente filtrados por workspace)
        
        Args:
            workspace: Workspace opcional para filtrar
            
        Returns:
            Lista de flujos
        """
        try:
            flows = []
            
            if workspace:
                search_path = FileManager.FLOWS_PATH / workspace
            else:
                search_path = FileManager.FLOWS_PATH
            
            if not search_path.exists():
                return []
            
            # Buscar archivos JSON recursivamente
            for filepath in search_path.rglob("*.json"):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        flow = json.load(f)
                        flows.append(flow)
                except json.JSONDecodeError:
                    logger.warning(f"Archivo JSON inválido: {filepath}")
                    continue
            
            logger.info(f"✅ Listados {len(flows)} flujos")
            return flows
        
        except Exception as e:
            logger.error(f"❌ Error listando flujos: {str(e)}")
            raise
    
    # ========================================================================
    # OPERACIONES DE WORKSPACES
    # ========================================================================
    
    @staticmethod
    def create_workspace(workspace_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crear un nuevo workspace
        
        Args:
            workspace_data: Datos del workspace
            
        Returns:
            Información de creación
        """
        try:
            workspace_name = workspace_data['name']
            
            # Crear archivo JSON del workspace
            filepath = FileManager.WORKSPACES_PATH / f"{workspace_name}.json"
            
            workspace_data['createdAt'] = datetime.utcnow().isoformat()
            workspace_data['flowCount'] = 0
            
            # Crear subcarpeta en flows
            (FileManager.FLOWS_PATH / workspace_name).mkdir(parents=True, exist_ok=True)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(workspace_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Workspace creado: {filepath}")
            
            return {
                "success": True,
                "name": workspace_name,
                "message": "Workspace creado correctamente"
            }
        
        except Exception as e:
            logger.error(f"❌ Error creando workspace: {str(e)}")
            raise
    
    @staticmethod
    def get_workspace(workspace_name: str) -> Optional[Dict[str, Any]]:
        """
        Obtener información de un workspace
        
        Args:
            workspace_name: Nombre del workspace
            
        Returns:
            Datos del workspace o None
        """
        try:
            filepath = FileManager.WORKSPACES_PATH / f"{workspace_name}.json"
            
            if filepath.exists():
                with open(filepath, 'r', encoding='utf-8') as f:
                    workspace = json.load(f)
                    
                    # Contar flujos en este workspace
                    flows = FileManager.list_flows(workspace_name)
                    workspace['flowCount'] = len(flows)
                    
                    return workspace
            
            return None
        
        except Exception as e:
            logger.error(f"❌ Error leyendo workspace: {str(e)}")
            raise
    
    @staticmethod
    def list_workspaces() -> List[Dict[str, Any]]:
        """
        Listar todos los workspaces
        
        Returns:
            Lista de workspaces
        """
        try:
            workspaces = []
            
            if FileManager.WORKSPACES_PATH.exists():
                for filepath in FileManager.WORKSPACES_PATH.glob("*.json"):
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            workspace = json.load(f)
                            
                            # Contar flujos
                            flows = FileManager.list_flows(workspace['name'])
                            workspace['flowCount'] = len(flows)
                            
                            workspaces.append(workspace)
                    except json.JSONDecodeError:
                        logger.warning(f"Archivo JSON inválido: {filepath}")
                        continue
            
            return workspaces
        
        except Exception as e:
            logger.error(f"❌ Error listando workspaces: {str(e)}")
            raise
    
    # ========================================================================
    # OPERACIONES ESPECIALES
    # ========================================================================
    
    @staticmethod
    def get_flow_with_subflows(flow_id: str, workspace: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Obtener un flujo y resolver todas sus referencias de sub-flujos
        
        Args:
            flow_id: ID del flujo principal
            workspace: Workspace opcional
            
        Returns:
            Flujo con sub-flujos resueltos
        """
        try:
            flow = FileManager.get_flow(flow_id, workspace)
            if not flow:
                return None
            
            # Resolver referencias de sub-flujos
            for node in flow.get('nodes', []):
                if node.get('type') == 'subflow' and 'reference' in node.get('data', {}):
                    ref = node['data']['reference']
                    # Extraer ID de la referencia
                    subflow_id = ref.split('_')[-1].replace('.json', '')
                    subflow = FileManager.get_flow(subflow_id, workspace)
                    if subflow:
                        node['data']['resolvedSubflow'] = subflow
            
            return flow
        
        except Exception as e:
            logger.error(f"❌ Error resolviendo sub-flujos: {str(e)}")
            raise


# Instancia global
file_manager = FileManager()


-------------------------------------------------
"""
Servicio de Exportación a ASCII
Convierte diagramas de flujo a formato ASCII art para compartir en texto plano
"""

import logging
from typing import Dict, List, Any, Set, Tuple
from collections import defaultdict

logger = logging.getLogger(__name__)


class ExportService:
    """Servicio para exportar flujos a formato ASCII"""
    
    # Símbolos ASCII
    SYMBOLS = {
        'start': '●',
        'end': '●',
        'process': '□',
        'decision': '◇',
        'subflow': '▢',
        'horizontal': '─',
        'vertical': '│',
        'corner_tl': '┌',
        'corner_tr': '┐',
        'corner_bl': '└',
        'corner_br': '┘',
        'tee_down': '┬',
        'tee_up': '┴',
        'tee_left': '┤',
        'tee_right': '├',
        'cross': '┼',
        'arrow': '→',
        'arrow_down': '↓',
        'arrow_up': '↑',
        'arrow_right': '→',
        'diamond_left': '◄',
        'diamond_right': '►',
    }
    
    # Estilos de condición
    CONDITION_STYLES = {
        'yes': '✓',
        'no': '✗',
        'true': '✓',
        'false': '✗',
    }
    
    @staticmethod
    def export_flow(flow: Dict[str, Any]) -> str:
        """
        Exportar un flujo completo a ASCII art
        
        Args:
            flow: Diccionario del flujo
            
        Returns:
            String con el diagrama ASCII
        """
        try:
            lines = []
            
            # Header
            lines.append("┌" + "─" * 70 + "┐")
            lines.append(f"│ DIAGRAMA DE FLUJO: {flow.get('name', 'Sin nombre'):<54} │")
            
            description = flow.get('description', '')
            if description:
                desc_truncated = description[:66]
                lines.append(f"│ Descripción: {desc_truncated:<54} │")
            
            lines.append("└" + "─" * 70 + "┘")
            lines.append("")
            
            # Obtener nodos y conexiones
            nodes = flow.get('nodes', [])
            edges = flow.get('edges', [])
            
            if not nodes:
                lines.append("[Sin nodos definidos]")
                return "\n".join(lines)
            
            # Construir árbol de nodos
            node_tree = ExportService._build_node_tree(nodes, edges)
            
            # Renderizar árbol
            rendered = ExportService._render_tree(node_tree, nodes, edges)
            lines.extend(rendered)
            
            lines.append("")
            lines.append(f"Total de nodos: {len(nodes)}")
            lines.append(f"Total de conexiones: {len(edges)}")
            
            return "\n".join(lines)
        
        except Exception as e:
            logger.error(f"Error exportando flujo: {str(e)}")
            return f"Error en exportación: {str(e)}"
    
    @staticmethod
    def _build_node_tree(nodes: List[Dict], edges: List[Dict]) -> Dict[str, List[str]]:
        """
        Construir árbol de nodos desde el flujo
        
        Args:
            nodes: Lista de nodos
            edges: Lista de conexiones
            
        Returns:
            Diccionario con estructura de árbol
        """
        # Crear mapa de conexiones
        connections = defaultdict(list)
        for edge in edges:
            source = edge['source']
            target = edge['target']
            condition = edge.get('data', {}).get('condition', '')
            connections[source].append({
                'target': target,
                'condition': condition
            })
        
        # Encontrar nodo raíz (START)
        all_targets = {edge['target'] for edge in edges}
        roots = [n['id'] for n in nodes if n['id'] not in all_targets]
        
        if not roots:
            roots = [nodes[0]['id']] if nodes else []
        
        return connections
    
    @staticmethod
    def _render_tree(connections: Dict, nodes: List[Dict], edges: List[Dict], 
                     max_depth: int = 50) -> List[str]:
        """
        Renderizar árbol de nodos como ASCII
        
        Args:
            connections: Mapa de conexiones
            nodes: Lista de nodos
            edges: Lista de conexiones
            max_depth: Profundidad máxima para evitar bucles infinitos
            
        Returns:
            Lista de líneas ASCII
        """
        lines = []
        node_map = {n['id']: n for n in nodes}
        
        # Encontrar nodos raíz
        all_targets = {edge['target'] for edge in edges}
        roots = [n['id'] for n in nodes if n['id'] not in all_targets]
        
        if not roots:
            roots = [nodes[0]['id']] if nodes else []
        
        # Renderizar desde cada raíz
        visited = set()
        
        for root_id in roots:
            ExportService._render_node(
                node_id=root_id,
                node_map=node_map,
                connections=connections,
                lines=lines,
                prefix="",
                visited=visited,
                depth=0,
                max_depth=max_depth
            )
        
        return lines
    
    @staticmethod
    def _render_node(node_id: str, node_map: Dict, connections: Dict,
                     lines: List[str], prefix: str = "", visited: Set[str] = None,
                     depth: int = 0, max_depth: int = 50) -> None:
        """
        Renderizar un nodo y sus hijos recursivamente
        
        Args:
            node_id: ID del nodo actual
            node_map: Mapa de nodos
            connections: Mapa de conexiones
            lines: Lista de líneas a escribir
            prefix: Prefijo de indentación
            visited: Conjunto de nodos visitados (para evitar bucles)
            depth: Profundidad actual
            max_depth: Profundidad máxima
        """
        if visited is None:
            visited = set()
        
        if depth > max_depth or node_id in visited:
            return
        
        visited.add(node_id)
        
        if node_id not in node_map:
            return
        
        node = node_map[node_id]
        node_type = node.get('type', 'process')
        label = node.get('label', 'Sin etiqueta')
        
        # Formatear nodo
        symbol = ExportService._get_node_symbol(node_type)
        node_str = f"{prefix}{symbol} {label}"
        lines.append(node_str)
        
        # Obtener hijos
        children = connections.get(node_id, [])
        
        if children:
            for i, child_info in enumerate(children):
                child_id = child_info['target']
                condition = child_info.get('condition', '')
                is_last = i == len(children) - 1
                
                # Símbolo de conexión
                if is_last:
                    connector = "└── "
                    child_prefix = prefix + "    "
                else:
                    connector = "├── "
                    child_prefix = prefix + "│   "
                
                # Añadir información de condición si existe
                if condition:
                    condition_symbol = ExportService.CONDITION_STYLES.get(condition, '→')
                    lines.append(f"{prefix}{connector[:-4]}{condition_symbol}  [{condition}]")
                    lines.append(f"{child_prefix}")
                else:
                    lines.append(f"{prefix}{connector[:-4]}{ExportService.SYMBOLS['arrow']}")
                
                # Renderizar hijo
                ExportService._render_node(
                    node_id=child_id,
                    node_map=node_map,
                    connections=connections,
                    lines=lines,
                    prefix=child_prefix,
                    visited=visited,
                    depth=depth + 1,
                    max_depth=max_depth
                )
    
    @staticmethod
    def _get_node_symbol(node_type: str) -> str:
        """Obtener símbolo ASCII para tipo de nodo"""
        symbols = {
            'start': '●',      # Círculo para inicio
            'end': '■',        # Cuadrado para fin
            'process': '□',    # Cuadrado vacío para proceso
            'decision': '◇',   # Diamante para decisión
            'subflow': '▢',    # Cuadrado doble para sub-flujo
            'input': '⬚',      # Para entrada
            'output': '⬛',     # Para salida
        }
        return symbols.get(node_type, '•')
    
    @staticmethod
    def export_flow_table(flow: Dict[str, Any]) -> str:
        """
        Exportar flujo como tabla de nodos
        
        Args:
            flow: Diccionario del flujo
            
        Returns:
            String con formato de tabla
        """
        lines = []
        
        lines.append("┌────────┬──────────────┬────────────┬──────────────┐")
        lines.append("│ ID     │ Tipo         │ Etiqueta   │ Descripción  │")
        lines.append("├────────┼──────────────┼────────────┼──────────────┤")
        
        for node in flow.get('nodes', []):
            node_id = node.get('id', '')[:8]
            node_type = node.get('type', '')
            label = node.get('label', '')[:10]
            desc = node.get('data', {}).get('description', '')[:12]
            
            lines.append(f"│ {node_id:<6} │ {node_type:<12} │ {label:<10} │ {desc:<12} │")
        
        lines.append("└────────┴──────────────┴────────────┴──────────────┘")
        
        return "\n".join(lines)
    
    @staticmethod
    def export_flow_compact(flow: Dict[str, Any]) -> str:
        """
        Exportar flujo en formato compacto (una línea)
        
        Args:
            flow: Diccionario del flujo
            
        Returns:
            String en formato compacto
        """
        nodes = flow.get('nodes', [])
        edges = flow.get('edges', [])
        
        if not nodes:
            return "[Flujo vacío]"
        
        # Ordenar nodos por tipo
        start_nodes = [n for n in nodes if n.get('type') == 'start']
        process_nodes = [n for n in nodes if n.get('type') == 'process']
        decision_nodes = [n for n in nodes if n.get('type') == 'decision']
        end_nodes = [n for n in nodes if n.get('type') == 'end']
        
        parts = []
        
        if start_nodes:
            parts.append(" → ".join([n.get('label', 'Inicio') for n in start_nodes]))
        
        if process_nodes:
            parts.append(" → ".join([n.get('label', 'Proceso') for n in process_nodes]))
        
        if decision_nodes:
            parts.append(" ◇ ".join([n.get('label', 'Decisión') for n in decision_nodes]))
        
        if end_nodes:
            parts.append(" → ".join([n.get('label', 'Fin') for n in end_nodes]))
        
        return " → ".join(parts) if parts else "[Flujo sin nodos]"


# Instancia global
export_service = ExportService()



------------------

"""
Rutas de API para gestión de Flujos
Endpoints CRUD principales
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List
import logging

from app.models.flow import Flow, FlowCreate, FlowUpdate, FlowResponse, FlowListResponse
from app.services.file_manager import file_manager

logger = logging.getLogger(__name__)

router = APIRouter()

# ============================================================================
# CREATE - POST /api/flows
# ============================================================================

@router.post("", response_model=FlowResponse, status_code=201)
async def create_flow(
    flow_data: FlowCreate = Body(..., description="Datos del nuevo flujo")
):
    """
    Crear un nuevo flujo
    
    Parámetros:
    - **name**: Nombre del flujo (requerido)
    - **description**: Descripción (opcional)
    - **workspace**: Grupo/workspace al que pertenece (opcional)
    - **nodes**: Lista de nodos
    - **edges**: Lista de conexiones
    
    Retorna:
    - Flujo creado con ID único
    """
    try:
        # Convertir a diccionario
        flow_dict = flow_data.dict()
        
        # Guardar en archivo
        result = file_manager.save_flow(flow_dict)
        
        # Obtener flujo guardado
        saved_flow = file_manager.get_flow(result['id'], flow_dict.get('workspace'))
        
        return FlowResponse(
            success=True,
            message="Flujo creado exitosamente",
            data=Flow(**saved_flow)
        )
    
    except Exception as e:
        logger.error(f"Error creando flujo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear flujo: {str(e)}"
        )


# ============================================================================
# READ - GET /api/flows
# ============================================================================

@router.get("", response_model=FlowListResponse)
async def list_flows(
    workspace: Optional[str] = Query(None, description="Filtrar por workspace")
):
    """
    Listar todos los flujos
    
    Query Parameters:
    - **workspace**: Filtrar por workspace específico (opcional)
    
    Retorna:
    - Lista de flujos
    """
    try:
        flows_data = file_manager.list_flows(workspace)
        
        # Convertir a modelos Flow
        flows = [Flow(**flow) for flow in flows_data]
        
        return FlowListResponse(
            success=True,
            data=flows,
            count=len(flows),
            workspace=workspace
        )
    
    except Exception as e:
        logger.error(f"Error listando flujos: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al listar flujos: {str(e)}"
        )


# ============================================================================
# READ - GET /api/flows/{flow_id}
# ============================================================================

@router.get("/{flow_id}", response_model=FlowResponse)
async def get_flow(
    flow_id: str,
    workspace: Optional[str] = Query(None, description="Workspace del flujo"),
    include_subflows: bool = Query(False, description="Resolver sub-flujos")
):
    """
    Obtener un flujo específico por ID
    
    Path Parameters:
    - **flow_id**: ID del flujo
    
    Query Parameters:
    - **workspace**: Workspace del flujo (opcional)
    - **include_subflows**: Resolver referencias de sub-flujos (opcional)
    
    Retorna:
    - Flujo solicitado con toda su estructura
    """
    try:
        if include_subflows:
            flow_data = file_manager.get_flow_with_subflows(flow_id, workspace)
        else:
            flow_data = file_manager.get_flow(flow_id, workspace)
        
        if not flow_data:
            raise HTTPException(
                status_code=404,
                detail=f"Flujo {flow_id} no encontrado"
            )
        
        return FlowResponse(
            success=True,
            message="Flujo obtenido exitosamente",
            data=Flow(**flow_data)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo flujo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al obtener flujo: {str(e)}"
        )


# ============================================================================
# UPDATE - PUT /api/flows/{flow_id}
# ============================================================================

@router.put("/{flow_id}", response_model=FlowResponse)
async def update_flow(
    flow_id: str,
    flow_update: FlowUpdate = Body(..., description="Datos a actualizar"),
    workspace: Optional[str] = Query(None, description="Workspace del flujo")
):
    """
    Actualizar un flujo existente
    
    Path Parameters:
    - **flow_id**: ID del flujo a actualizar
    
    Query Parameters:
    - **workspace**: Workspace del flujo (opcional)
    
    Body:
    - Campos a actualizar (name, description, nodes, edges)
    
    Retorna:
    - Flujo actualizado
    """
    try:
        # Convertir update a diccionario y filtrar None values
        update_dict = {k: v for k, v in flow_update.dict().items() if v is not None}
        update_dict['workspace'] = workspace
        
        # Actualizar
        result = file_manager.update_flow(flow_id, update_dict)
        
        if not result['success']:
            raise HTTPException(
                status_code=404,
                detail="Flujo no encontrado"
            )
        
        # Obtener flujo actualizado
        updated_flow = file_manager.get_flow(flow_id, workspace)
        
        return FlowResponse(
            success=True,
            message="Flujo actualizado exitosamente",
            data=Flow(**updated_flow)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error actualizando flujo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar flujo: {str(e)}"
        )


# ============================================================================
# DELETE - DELETE /api/flows/{flow_id}
# ============================================================================

@router.delete("/{flow_id}", status_code=204)
async def delete_flow(
    flow_id: str,
    workspace: Optional[str] = Query(None, description="Workspace del flujo")
):
    """
    Eliminar un flujo
    
    Path Parameters:
    - **flow_id**: ID del flujo a eliminar
    
    Query Parameters:
    - **workspace**: Workspace del flujo (opcional)
    """
    try:
        result = file_manager.delete_flow(flow_id, workspace)
        
        if not result['success']:
            raise HTTPException(
                status_code=404,
                detail="Flujo no encontrado"
            )
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error eliminando flujo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al eliminar flujo: {str(e)}"
        )


# ============================================================================
# ENDPOINTS ADICIONALES
# ============================================================================

@router.get("/{flow_id}/summary", tags=["Analysis"])
async def get_flow_summary(
    flow_id: str,
    workspace: Optional[str] = Query(None)
):
    """
    Obtener resumen de un flujo
    
    Retorna:
    - Información resumida del flujo (cantidad de nodos, decisiones, etc)
    """
    try:
        flow_data = file_manager.get_flow(flow_id, workspace)
        
        if not flow_data:   
            raise HTTPException(status_code=404, detail="Flujo no encontrado")
        
        nodes = flow_data.get('nodes', [])
        edges = flow_data.get('edges', [])
        
        # Contar tipos de nodos
        node_types = {}
        for node in nodes:
            node_type = node.get('type', 'unknown')
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        return {
            "success": True,
            "flowId": flow_id,
            "flowName": flow_data.get('name'),
            "summary": {
                "totalNodes": len(nodes),
                "totalEdges": len(edges),
                "nodeTypes": node_types,
                "hasSubflows": any(n.get('type') == 'subflow' for n in nodes),
                "createdAt": flow_data.get('createdAt'),
                "updatedAt": flow_data.get('updatedAt'),
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo resumen: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al obtener resumen: {str(e)}"
        )


@router.post("/{flow_id}/duplicate", response_model=FlowResponse, status_code=201)
async def duplicate_flow(
    flow_id: str,
    new_name: str = Query(..., description="Nombre para el flujo duplicado"),
    workspace: Optional[str] = Query(None)
):
    """
    Duplicar un flujo existente
    
    Path Parameters:
    - **flow_id**: ID del flujo a duplicar
    
    Query Parameters:
    - **new_name**: Nombre para la copia
    - **workspace**: Workspace (opcional)
    
    Retorna:
    - Nuevo flujo duplicado
    """
    try:
        # Obtener flujo original
        original = file_manager.get_flow(flow_id, workspace)
        
        if not original:
            raise HTTPException(status_code=404, detail="Flujo no encontrado")
        
        # Crear copia
        copy_data = original.copy()
        copy_data['name'] = new_name
        copy_data.pop('id', None)  # Remover ID para generar uno nuevo
        
        # Guardar
        result = file_manager.save_flow(copy_data)
        
        saved_copy = file_manager.get_flow(result['id'], workspace)
        
        return FlowResponse(
            success=True,
            message=f"Flujo duplicado como '{new_name}'",
            data=Flow(**saved_copy)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error duplicando flujo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al duplicar flujo: {str(e)}"
        )