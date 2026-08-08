# 🎯 DinamicLocalFlows

> **Aplicación web de flujos de trabajo interactivos, modulares y enlazables**

Una herramienta moderna para diseñar, visualizar y gestionar diagramas de flujo complejos con capacidades 2D/3D, almacenamiento local y exportación a múltiples formatos.

## ✨ Características Principales

- 🎨 **Editor Visual Interactivo** - Diseña flujos con arrastrar y soltar
- 🔄 **Vistas Dual (2D/3D)** - React Flow para 2D y Force Graph para 3D
- 💾 **Almacenamiento Local** - Guarda flujos en JSON local sin servidor
- 📦 **Sistema de Workspaces** - Organiza flujos en grupos/proyectos
- 🔗 **Sub-flujos** - Crea flujos reutilizables y anidables
- 📝 **Exportación ASCII** - Comparte diagramas en texto plano
- ✅ **Diseño Glassmorphism** - UI moderna con efectos visuales elegantes
- 🚀 **Zero Configuración** - Funciona 100% local sin dependencias externas

## 🏗️ Stack Tecnológico

### Frontend
```
React 18 + Vite 5
├── Tailwind CSS (Diseño)
├── React Flow (Canvas 2D)
├── React Force Graph (Canvas 3D)
├── Zustand (State Management)
└── Axios (HTTP Client)
```

### Backend
```
FastAPI 0.104
├── Pydantic (Validación)
├── Uvicorn (ASGI Server)
└── Sistema de Archivos Local
```

## 📦 Instalación Rápida

### Requisitos Previos
- Node.js 16+ 
- Python 3.9+
- npm o yarn

### Paso 1: Clonar Repositorio
```bash
git clone https://github.com/CamiloTechCore/DinamicLocalFlows.git
cd DinamicLocalFlows
```

### Paso 2: Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```
Accede a: **http://localhost:5173**

### Paso 3: Configurar Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
API disponible en: **http://localhost:8000/api**

Documentación API: **http://localhost:8000/api/docs**

---

## 🚀 Uso Rápido

### Crear un Flujo

1. **Abre la aplicación** en http://localhost:5173
2. **Haz clic en "Nuevo Flujo"** en el panel izquierdo
3. **Completa el wizard de 3 pasos**:
   - Datos básicos (nombre, descripción, workspace)
   - Agregar nodos (Inicio, Proceso, Decisión, Fin)
   - Definir conexiones entre nodos
4. **Guarda** - El flujo se almacena automáticamente en `database/flows/`

### Visualizar en 3D

- **Usa el botón toggle** en la esquina superior derecha del canvas
- Alterna entre vista 2D (React Flow) y 3D (Force Graph)
- Interactúa con el gráfico: arrastra nodos, zoom con rueda del ratón

### Exportar Diagrama

```bash
# Endpoint de API
GET /api/export/{flow_id}?format=tree

# Formatos disponibles:
# - tree: Árbol ASCII jerárquico (por defecto)
# - table: Tabla ASCII
# - compact: Una línea compacta
```

---

## 📁 Estructura de Carpetas

```
DinamicLocalFlows/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── layout/       # Layout principal
│   │   │   ├── canvas/       # Lienzo 2D/3D
│   │   │   ├── nodes/        # Nodos personalizados
│   │   │   ├── forms/        # Formularios
│   │   │   └── navigation/   # Navegación
│   │   ├── store/            # Zustand store
│   │   ├── services/         # Servicios API
│   │   └── styles/           # Estilos globales
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/           # Endpoints FastAPI
│   │   ├── models/           # Modelos Pydantic
│   │   ├── services/         # Lógica de negocio
│   │   └── utils/            # Utilidades
│   ├── database/             # Storage local (JSON)
│   ├── main.py               # Aplicación FastAPI
│   └── requirements.txt
│
└── README.md
```

---

## 🔌 API Endpoints

### Flujos

```bash
# Crear flujo
POST   /api/flows
Body:  { name, description, workspace, nodes[], edges[] }

# Listar flujos
GET    /api/flows?workspace=NombreWorkspace

# Obtener flujo específico
GET    /api/flows/{flowId}

# Actualizar flujo
PUT    /api/flows/{flowId}
Body:  { name, description, nodes[], edges[] }

# Eliminar flujo
DELETE /api/flows/{flowId}

# Obtener resumen
GET    /api/flows/{flowId}/summary

# Duplicar flujo
POST   /api/flows/{flowId}/duplicate?new_name=NombreCopia
```

### Workspaces

```bash
# Crear workspace
POST   /api/workspaces
Body:  { name, description, icon }

# Listar workspaces
GET    /api/workspaces

# Obtener workspace
GET    /api/workspaces/{name}
```

### Exportación

```bash
# Exportar a ASCII
GET    /api/export/{flowId}?format=tree|table|compact
Response: { ascii: "string con diagrama ASCII" }
```

---

## 📊 Esquema JSON de Flujo

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Proceso de Aprobación",
  "description": "Flujo de validación y aprobación",
  "workspace": "Finanzas",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:45:00Z",
  "nodes": [
    {
      "id": "node-1",
      "type": "start",
      "label": "Inicio",
      "position": { "x": 0, "y": 0 },
      "data": { "trigger": "manual" }
    },
    {
      "id": "node-2",
      "type": "process",
      "label": "Validar Datos",
      "position": { "x": 200, "y": 0 },
      "data": { "description": "Verificar entrada" }
    },
    {
      "id": "node-3",
      "type": "decision",
      "label": "¿Válido?",
      "position": { "x": 400, "y": 0 },
      "data": { "conditions": [{ "label": "Sí" }, { "label": "No" }] }
    },
    {
      "id": "node-4",
      "type": "end",
      "label": "Fin",
      "position": { "x": 600, "y": 0 },
      "data": { "status": "completed" }
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
    }
  ]
}
```

---

## 🎨 Tipos de Nodos

| Tipo | Símbolo | Descripción |
|------|---------|-------------|
| **Start** | ● | Punto de inicio del flujo |
| **End** | ■ | Punto final del flujo |
| **Process** | □ | Tarea o proceso a ejecutar |
| **Decision** | ◇ | Bifurcación condicional |
| **SubFlow** | ▢ | Referencia a otro flujo |
| **Input** | ⬚ | Entrada de datos |
| **Output** | ⬛ | Salida de datos |

---

## 🔐 Características de Seguridad

✅ Validación de entrada con Pydantic  
✅ Sanitización de nombres de archivo  
✅ CORS configurado para localhost  
✅ Manejo robusto de errores  
✅ Sin dependencias de API externa  

---

## 📈 Roadmap

- [x] Arquitectura base (Frontend + Backend)
- [x] Editor 2D con React Flow
- [ ] Integración 3D con Force Graph
- [ ] Wizard de creación de flujos
- [ ] Sistema completo de Workspaces
- [ ] Exportación ASCII mejorada
- [ ] Historial de cambios (Undo/Redo)
- [ ] Colaboración en tiempo real (opcional)
- [ ] Temas oscuro/claro
- [ ] Plugin system

---

## 🐛 Solucionar Problemas

### Puerto 8000 en uso
```bash
# Cambiar puerto en backend/run.py
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### CORS error
```
Verifica que backend esté corriendo en http://localhost:8000
```

### Archivos JSON no se guardan
```
Asegúrate de que exista la carpeta database/flows
Si no, el backend la creará automáticamente
```

---

## 📚 Documentación Completa

- 📖 [Guía de Arquitectura](./ARCHITECTURE_GUIDE.md) - Diseño técnico detallado
- 🚀 [Guía de Implementación](./IMPLEMENTATION_GUIDE.md) - Pasos para desarrollar
- 🔌 [Documentación API](http://localhost:8000/api/docs) - Swagger interactivo

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Camilo Tech Core**

- GitHub: [@CamiloTechCore](https://github.com/CamiloTechCore)
- Email: contacto@camilotech.com

---

## 💡 Cita y Agradecimientos

Construido con ❤️ usando:
- [React Flow](https://reactflow.dev/) para visualización 2D
- [React Force Graph](https://github.com/vasturiano/react-force-graph) para 3D
- [FastAPI](https://fastapi.tiangolo.com/) para backend robusto
- [Tailwind CSS](https://tailwindcss.com/) para diseño moderno

---

## 📧 Soporte

¿Preguntas o problemas?
- Abre un [Issue en GitHub](https://github.com/CamiloTechCore/DinamicLocalFlows/issues)
- Contacta directamente: contacto@camilotech.com

---

**¡Disfruta creando flujos con DinamicLocalFlows! 🚀**