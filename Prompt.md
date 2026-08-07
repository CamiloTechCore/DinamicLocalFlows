Rol: Actúa como un Arquitecto de Software y Desarrollador Full-Stack experto.
Objetivo: Inicializar y programar una aplicación web de ejecución local basada en Python (FastAPI) y React (Vite) para diseñar diagramas de flujo interactivos modulares y enlazables.

1. Requerimientos de Arquitectura y Estilos (Frontend)
Stack: Inicializa un proyecto con React y Vite. Configura Tailwind CSS.

Estructura de Carpetas: Crea dentro de src/components/ las siguientes subcarpetas: layout/, navigation/, forms/, nodes/, y canvas/.

Estilos y UI: * Aplica un fondo global elegante (ej. gradiente oscuro bg-gradient-to-br from-slate-900 to-black).

Implementa un diseño "glassmorphism" (vidrio líquido) para un panel flotante izquierdo con posición absoluta.

Utiliza las siguientes clases utilitarias de Tailwind en los paneles: bg-white/10, backdrop-blur-lg, border border-white/20, y shadow-xl.

Crea un formulario tipo "wizard" (por pasos continuos) dentro de forms/ para ir recolectando los datos del flujo (datos básicos, nodos, decisiones) de modo que alimente un estado global en tiempo real.

2. Requerimientos del Lienzo y Visualización
Integración 2D: Usa la librería React Flow en la carpeta canvas/ para la vista principal.

Nodos Personalizados: Diseña nodos específicos dentro de nodes/ para manejar Inicios, Fines, y Criterios de Decisión (que soporten ramificaciones condicionales extensas).

Integración 3D: Implementa la librería react-force-graph para el renderizado tridimensional.

Toggle: Añade un botón/interruptor en el lienzo (en la esquina superior derecha) para alternar de manera fluida entre la vista de motor 2D y la vista 3D.

3. Requerimientos del Backend y Sistema de Archivos (FastAPI)
API Local: Construye el backend en FastAPI para gestionar la lectura y escritura rápida de archivos.

Base de Datos Local (Carpetas): * Configura una carpeta principal llamada database/.

Implementa una lógica donde, si un flujo pertenece a un "grupo de trabajo", se cree dinámicamente una subcarpeta con el nombre del proyecto o grupo (ej. database/NombreGrupo/). Si no tiene grupo, se guarda en la raíz de database/.

Guardado de Archivos JSON: * Guarda cada flujo como un archivo JSON individual de manera local.

El nombre del archivo debe generarse concatenando el nombre principal del proceso y un ID único (UUID o Timestamp) para diferenciarlos. Formato: NombreProceso_ID.json.

Sub-flujos: Asegura que el esquema JSON guarde referencias precisas (hipervínculos lógicos) a otros archivos JSON para permitir que un nodo de tipo "sub-flujo" cargue un proceso completamente diferente al hacerle clic.

Exportación a Texto: Desarrolla un endpoint en Python que ejecute una función recursiva para recorrer la estructura (nodos y bordes) del JSON. Este endpoint debe devolver una representación en texto plano (un pequeño diagrama ASCII usando guiones, tabulaciones y flechas) lista para copiar y pegar en chats.