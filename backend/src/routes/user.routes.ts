// src/routes/user.routes.ts
import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';

const router = Router();

// Cuando el frontend haga un GET a "/", se ejecutará el controlador getUsers
router.get('/', getUsers);

// EXPORTACIÓN VITAL
export default router;