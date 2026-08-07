// src/controllers/flow.controller.ts
import { Request, Response } from 'express';
import { saveFlowData, generateAsciiArt } from '../services/flow.service';

export const createFlow = (req: Request, res: Response): void => {
  try {
    // Extraemos la información que nos envía el frontend en el cuerpo de la petición (body)
    const { processName, flowData, groupName } = req.body;

    // Validación básica: asegurarnos de que existan los datos obligatorios
    if (!processName || !flowData) {
      res.status(400).json({ error: 'El processName y el flowData son obligatorios.' });
      return;
    }

    // 1. Guardar el archivo JSON localmente
    const dbResult = saveFlowData(processName, flowData, groupName);

    // 2. Generar el formato de texto plano para compartir
    const asciiExport = generateAsciiArt(flowData);

    // 3. Responder al frontend con un código 201 (Creado)
    res.status(201).json({
      success: true,
      fileInfo: dbResult,
      ascii: asciiExport
    });

  } catch (error) {
    console.error("Error al procesar el flujo:", error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el archivo.' });
  }
};