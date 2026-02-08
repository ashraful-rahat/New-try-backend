"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notice_controller_1 = require("../controller/notice.controller");
const router = (0, express_1.Router)();
// Create notice
router.post('/create', notice_controller_1.noticeController.create);
// Get all notices
router.get('/', notice_controller_1.noticeController.getAll);
// Get today's notices
router.get('/today', notice_controller_1.noticeController.getToday);
// Get upcoming notices
router.get('/upcoming', notice_controller_1.noticeController.getUpcoming);
// Get important notices
router.get('/important', notice_controller_1.noticeController.getImportant);
// Get single notice
router.get('/:id', notice_controller_1.noticeController.getById);
// Update notice
router.patch('/:id', notice_controller_1.noticeController.update);
// Delete notice
router.delete('/:id', notice_controller_1.noticeController.delete);
exports.default = router;
