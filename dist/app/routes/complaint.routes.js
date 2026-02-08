"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = require("../controller/complaint.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ===== PUBLIC ROUTES (SPECIFIC FIRST!) =====
router.get('/stats', complaint_controller_1.complaintController.getStats);
router.post('/create', complaint_controller_1.complaintController.create);
router.post('/track', complaint_controller_1.complaintController.track);
// ===== ADMIN ROUTES (Protected) =====
// 🟢 Rule: Specific routes with more segments come FIRST
// Get all complaints (admin only)
router.get('/', (0, auth_middleware_1.authenticate)(), complaint_controller_1.complaintController.getAll);
// Update status - এটা /:id এর আগে রাখতে হবে!
router.patch('/:id/status', (0, auth_middleware_1.authenticate)(), complaint_controller_1.complaintController.updateStatus);
// Delete complaint
router.delete('/:id', (0, auth_middleware_1.authenticate)(), complaint_controller_1.complaintController.delete);
// Get single complaint - এটা সবার শেষে!
router.get('/:id', (0, auth_middleware_1.authenticate)(), complaint_controller_1.complaintController.getById);
exports.default = router;
