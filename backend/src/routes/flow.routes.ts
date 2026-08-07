// src/routes/flow.routes.ts
import { Router } from 'express';
import { createFlow } from '../controllers/flow.controller';

const router = Router();

// Cuando el cliente haga un POST a esta ruta, se ejecutará "createFlow"
router.post('/', createFlow);

// EXPORTACIÓN VITAL: Esto permite que app.ts reciba una función válida
export default router;