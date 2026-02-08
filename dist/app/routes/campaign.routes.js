"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controller/campaign.controller");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
// ======================
// PUBLIC ROUTES (SPECIFIC ROUTES FIRST!)
// ======================
// Get all campaigns - এটা উপরে রাখুন
router.get('/', campaign_controller_1.campaignController.getAll);
// Get active campaigns (frontend)
router.get('/active', campaign_controller_1.campaignController.getActive);
// Get campaign statistics
router.get('/stats', campaign_controller_1.campaignController.getStats);
// ======================
// CAMPAIGN MANAGEMENT ROUTES
// ======================
// Create new campaign with multiple images
router.post('/create', multer_1.campaignUpload.array('images', 10), campaign_controller_1.campaignController.create);
// Update campaign status - এটা /:id এর আগে
router.patch('/:id/status', campaign_controller_1.campaignController.updateStatus);
// ======================
// IMAGE MANAGEMENT ROUTES (/:id এর আগে)
// ======================
// Add more images to existing campaign
router.post('/:id/images', multer_1.campaignUpload.array('images', 10), campaign_controller_1.campaignController.addImages);
// Remove specific image from campaign
router.delete('/:id/images/:publicId', campaign_controller_1.campaignController.removeImage);
// ======================
// DYNAMIC ROUTES (সবার শেষে!)
// ======================
// Get single campaign by ID - এটা সবার শেষে
router.get('/:id', campaign_controller_1.campaignController.getById);
// Update campaign (info + optional images)
router.patch('/:id', multer_1.campaignUpload.array('images', 10), campaign_controller_1.campaignController.update);
// Delete campaign
router.delete('/:id', campaign_controller_1.campaignController.delete);
exports.default = router;
