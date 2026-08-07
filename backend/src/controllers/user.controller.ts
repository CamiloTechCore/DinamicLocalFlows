// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { getAllUsersService } from '../services/user.service';

export const getUsers = (req: Request, res: Response) => {
  try {
    const users = getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};