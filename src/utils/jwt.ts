import jwt from 'jsonwebtoken';
import { AdminRole } from '../app/interfaces/auth.interface';

export const generateToken = (id: string, email: string, role: AdminRole) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
};
