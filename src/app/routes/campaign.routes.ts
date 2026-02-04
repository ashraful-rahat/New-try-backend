import { Router } from 'express';
import { campaignController } from '../controller/campaign.controller';
import { campaignUpload } from '../middleware/multer';

const router = Router();

// ======================
// PUBLIC ROUTES
// ======================

// Get active campaigns (frontend)
router.get('/active', campaignController.getActive);

// Get campaign statistics
router.get('/stats', campaignController.getStats);

// Get single campaign by ID
router.get('/:id', campaignController.getById);

// ======================
// CAMPAIGN MANAGEMENT ROUTES
// ======================

// Create new campaign with multiple images
router.post('/create', campaignUpload.array('images', 10), campaignController.create);

// Get all campaigns
router.get('/', campaignController.getAll);

// Update campaign (info + optional images)
router.patch('/:id', campaignUpload.array('images', 10), campaignController.update);

// Update campaign status
router.patch('/:id/status', campaignController.updateStatus);

// Delete campaign
router.delete('/:id', campaignController.delete);

// ======================
// IMAGE MANAGEMENT ROUTES
// ======================

// Add more images to existing campaign
router.post('/:id/images', campaignUpload.array('images', 10), campaignController.addImages);

// Remove specific image from campaign
router.delete('/:id/images/:publicId', campaignController.removeImage);

export default router;
