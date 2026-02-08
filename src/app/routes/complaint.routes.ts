import { Router } from 'express';
import { complaintController } from '../controller/complaint.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// ===== PUBLIC ROUTES (SPECIFIC FIRST!) =====
router.get('/stats', complaintController.getStats);
router.post('/create', complaintController.create);
router.post('/track', complaintController.track);

// ===== ADMIN ROUTES (Protected) =====
// 🟢 Rule: Specific routes with more segments come FIRST

// Get all complaints (admin only)
router.get('/', authenticate(), complaintController.getAll);

// Update status - এটা /:id এর আগে রাখতে হবে!
router.patch('/:id/status', authenticate(), complaintController.updateStatus);

// Delete complaint
router.delete('/:id', authenticate(), complaintController.delete);

// Get single complaint - এটা সবার শেষে!
router.get('/:id', authenticate(), complaintController.getById);

export default router;
