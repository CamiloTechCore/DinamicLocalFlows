// src/services/flow.service.ts
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Definimos la ruta absoluta hacia la carpeta "database"
// El ../../ sube dos niveles desde src/services hacia la raíz del backend
const DATABASE_PATH = path.join(__dirname, '../../database');

/**
 * Guarda el flujo de trabajo en un archivo JSON local.
 * @param processName El nombre del proceso (ej. "EnvioDeCorreos").
 * @param flowData Los datos del grafo en formato JSON.
 * @param groupName (Opcional) El nombre del grupo de trabajo.
 */
export const saveFlowData = (processName: string, flowData: any, groupName?: string) => {
  // 1. Determinar la carpeta destino
  let targetFolder = DATABASE_PATH;
  
  // Si existe un grupo, actualizamos la ruta para crear/usar la subcarpeta
  if (groupName) {
    targetFolder = path.join(DATABASE_PATH, groupName);
  }

  // 2. Crear la estructura de carpetas si no existe
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // 3. Generar un ID único (UUID) y limpiar el nombre
  const uniqueId = crypto.randomUUID();
  const cleanName = processName.replace(/\s+/g, ''); // Quita los espacios del nombre
  
  // Formato: NombreDelProceso_IDUnico.json
  const fileName = `${cleanName}_${uniqueId}.json`; 
  const filePath = path.join(targetFolder, fileName);

  // 4. Escribir el archivo en disco (el '2' formatea el JSON para que sea legible)
  fs.writeFileSync(filePath, JSON.stringify(flowData, null, 2), 'utf-8');

  return {
    success: true,
    message: 'Flujo guardado correctamente',
    path: filePath,
    fileName: fileName
  };
};

/**
 * Convierte los datos de un flujo a diagrama de texto plano (ASCII Art).
 * @param flowData Los datos del flujo.
 */
export const generateAsciiArt = (flowData: any) => {
  let asciiResult = `=== FLUJO: ${flowData.name || 'Sin Título'} ===\n\n`;
  
  // Verificamos que el JSON contenga una propiedad "nodes" que sea un arreglo
  if (flowData.nodes && Array.isArray(flowData.nodes)) {
    flowData.nodes.forEach((node: any, index: number) => {
      // Dibujamos la caja del nodo
      asciiResult += `  [ ${node.label || 'Nodo Sin Nombre'} ]\n`;
      
      // Si no es el último nodo de la lista, dibujamos una flecha hacia abajo
      if (index < flowData.nodes.length - 1) {
        asciiResult += `       |\n       v\n`;
      }
    });
  } else {
    asciiResult += "El flujo no contiene nodos.";
  }

  return asciiResult;
};