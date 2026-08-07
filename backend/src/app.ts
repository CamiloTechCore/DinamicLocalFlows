// src/app.ts

// 1. IMPORTACIONES: Traemos todas las herramientas y rutas que necesitamos
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import flowRoutes from './routes/flow.routes';

// 2. INICIALIZACIÓN: Creamos la aplicación (la variable 'app' ya existe a partir de aquí)
const app = express();

// 3. MIDDLEWARES: Configuraciones base de la aplicación
app.use(cors()); // Permite conexiones externas
app.use(express.json()); // Permite entender datos en formato JSON

// 4. RUTAS: Le decimos a la 'app' qué hacer cuando el cliente visite ciertas URLs
app.use('/api/users', userRoutes);
app.use('/api/flows', flowRoutes); // <-- Ahora esto funciona porque 'app' se creó en el paso 2

// 5. ARRANQUE: Definimos el puerto y encendemos el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`¡Servidor corriendo exitosamente en http://localhost:${PORT}!`);
});