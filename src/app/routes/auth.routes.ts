import { Router } from 'express';
import { checkAuth, loginAdmin, registerAdmin } from '../controller/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected route
router.get('/check', authenticate(), checkAuth);

export default router;
