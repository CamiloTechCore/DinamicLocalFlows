# DinamicLocalFlows
Appweb para crear flujos de trabajo y procesos complejo con grafos integrados

# Blueprint del Proyecto "Flujos Dinámicos" (De 0 a Producción)

[cite_start]Este proyecto consiste en una aplicación web de ejecución local diseñada para crear y visualizar flujos de decisión y procesos de agentes de inteligencia artificial[cite: 147]. [cite_start]La herramienta emula la conexión de nodos característica de Obsidian, combinando un diseño moderno y modular[cite: 148].

---

## Módulo 0: Visión General y Stack Tecnológico

[cite_start]El proyecto está diseñado para funcionar de manera local, ofreciendo una interfaz gráfica adaptable (responsive) a dispositivos móviles[cite: 149].

| Capa | Tecnología | Función Principal |
| ------ | ------ | ------ |
| **Backend** | FastAPI (Python) | [cite_start]API local rápida para gestionar JSON y procesar exportaciones a texto[cite: 151]. |
| **Frontend** | React + Vite | [cite_start]UI dinámica, compilación instantánea y ejecución estática[cite: 152]. |
| **Estilos** | Tailwind CSS | [cite_start]Implementación rápida del diseño "vidrio líquido" mediante clases utilitarias[cite: 153]. |
| **Motor 2D** | React Flow | [cite_start]Nodos interactivos, ramificaciones complejas y soporte para sub-flujos[cite: 154]. |
| **Motor 3D** | react-force-graph | [cite_start]Renderizado de nodos en espacio tridimensional con físicas[cite: 155]. |

---

## Módulo 1: Diseño y Especificaciones UI (Estilos y Colores)

* [cite_start]El estilo visual predominante es el "glassmorphism" (vidrio líquido), emulando la estética de iOS 26[cite: 156].
* [cite_start]Para el fondo global de la aplicación (body), se recomienda aplicar un fondo elegante, como un gradiente oscuro (ej. `bg-gradient-to-br from-slate-900 to-black`)[cite: 205, 206].
* [cite_start]El formulario de creación reside en un panel en el lateral izquierdo, flotando sobre el lienzo principal con posición absoluta[cite: 157].
* [cite_start]Las clases CSS de Tailwind requeridas para el efecto de los paneles incluyen `bg-white/10`, `backdrop-blur-lg`, `border border-white/20`, y `shadow-xl`[cite: 158, 206].
* [cite_start]El formulario debe operar por pasos continuos (wizard) que alimenten un estado global en tiempo real[cite: 159].

---

## Módulo 2: Estructura de Componentes y Carpetas

[cite_start]La jerarquía del frontend debe mantener una separación estricta por responsabilidades para garantizar la escalabilidad[cite: 160].

* [cite_start]`src/components/layout`: Contenedores principales y diseño del fondo (body) de la aplicación[cite: 161].
* [cite_start]`src/components/navigation`: Barras de navegación y menús para organizar las bibliotecas y grupos de trabajo[cite: 162].
* [cite_start]`src/components/forms`: Componentes del formulario por pasos (datos iniciales, decisiones, ramas)[cite: 163].
* [cite_start]`src/components/nodes`: Diseños visuales específicos para cada tipo de nodo (inicio, final, decisión, sub-flujo)[cite: 164].
* [cite_start]`src/components/canvas`: El lienzo interactivo que ocupa el 100% de la pantalla e integra el interruptor (toggle) 2D/3D[cite: 165].

---

## Módulo 3: Lógica de Datos y Base de Datos Local (JSON)

[cite_start]Dado que no se utiliza un motor de base de datos tradicional, el sistema de archivos local actúa como la base de datos[cite: 194].

* [cite_start]**Carpeta Principal:** Todo se almacena en una carpeta raíz denominada `database/` (ubicada en el backend)[cite: 195].
* [cite_start]**Estructura de Grupos/Proyectos:** * Si un proceso no pertenece a un grupo, se guarda en la raíz de `database/`[cite: 196].
  * [cite_start]Si el flujo pertenece a un grupo de trabajo (ej. "Marketing IA"), se crea una subcarpeta: `database/Marketing IA/`[cite: 197].
* [cite_start]**Nomenclatura de Archivos:** Cada archivo JSON debe nombrarse combinando el nombre del proceso y un identificador único (UUID o Timestamp) para evitar colisiones[cite: 198]. [cite_start]Formato: `NombreDelProceso_IDUnico.json` (Ejemplo: EnvioDeCorreos_abc123.json)[cite: 199].
* [cite_start]**Hipervínculos Lógicos:** Dentro del JSON, los nodos de tipo "sub_flow" almacenarán la ruta o el nombre del archivo JSON hijo para poder cargarlo al hacer clic[cite: 200].

---

## Módulo 4: Visualización y Exportación a Texto

* [cite_start]**Interactividad:** Al finalizar el formulario, el lienzo derecho renderiza la gráfica en 2D[cite: 201]. [cite_start]Un interruptor (toggle) en la esquina superior derecha permite cambiar al modo 3D[cite: 202].
* [cite_start]**Exportación:** El backend procesa el archivo JSON actual y devuelve un "ASCII Art" o diagrama en texto plano (con tabulaciones, guiones y flechas), ideal para copiar al portapapeles y compartir en chats[cite: 203].
