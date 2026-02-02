import { Router } from 'express';
import { noticeController } from '../controller/notice.controller';

const router = Router();

// Create notice
router.post('/create', noticeController.create);

// Get all notices
router.get('/', noticeController.getAll);

// Get today's notices
router.get('/today', noticeController.getToday);

// Get upcoming notices
router.get('/upcoming', noticeController.getUpcoming);

// Get important notices
router.get('/important', noticeController.getImportant);

// Get single notice
router.get('/:id', noticeController.getById);

// Update notice
router.patch('/:id', noticeController.update);

// Delete notice
router.delete('/:id', noticeController.delete);

export default router;
