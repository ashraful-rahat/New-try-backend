import { Router } from 'express';
import { campaignController } from '../controller/campaign.controller';
import { campaignUpload } from '../middleware/multer';

const router = Router();

// ======================
// PUBLIC ROUTES (SPECIFIC ROUTES FIRST!)
// ======================

// Get all campaigns - এটা উপরে রাখুন
router.get('/', campaignController.getAll);

// Get active campaigns (frontend)
router.get('/active', campaignController.getActive);

// Get campaign statistics
router.get('/stats', campaignController.getStats);

// ======================
// CAMPAIGN MANAGEMENT ROUTES
// ======================

// Create new campaign with multiple images
router.post('/create', campaignUpload.array('images', 10), campaignController.create);

// Update campaign status - এটা /:id এর আগে
router.patch('/:id/status', campaignController.updateStatus);

// ======================
// IMAGE MANAGEMENT ROUTES (/:id এর আগে)
// ======================

// Add more images to existing campaign
router.post('/:id/images', campaignUpload.array('images', 10), campaignController.addImages);

// Remove specific image from campaign
router.delete('/:id/images/:publicId', campaignController.removeImage);

// ======================
// DYNAMIC ROUTES (সবার শেষে!)
// ======================

// Get single campaign by ID - এটা সবার শেষে
router.get('/:id', campaignController.getById);

// Update campaign (info + optional images)
router.patch('/:id', campaignUpload.array('images', 10), campaignController.update);

// Delete campaign
router.delete('/:id', campaignController.delete);

export default router;
