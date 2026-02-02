import { Router } from 'express';
import { complaintController } from '../controller/complaint.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// ===== PUBLIC ROUTES =====
router.post('/create', complaintController.create);
router.post('/track', complaintController.track);
router.get('/stats', complaintController.getStats);

// ===== ADMIN ROUTES (Protected) =====
router.get('/all', authenticate(), complaintController.getAll);
router.get('/:id', authenticate(), complaintController.getById);
router.patch('/:id/status', authenticate(), complaintController.updateStatus);
router.delete('/:id', authenticate(), complaintController.delete);

export default router;
