import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email এবং password দিন' });
    }

    const result = await authService.register({ email, password });

    res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email এবং password দিন' });
    }

    const result = await authService.login({ email, password });

    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'ভুল email বা password' });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated',
    admin: (req as any).admin, // JWT decoded user
  });
};
