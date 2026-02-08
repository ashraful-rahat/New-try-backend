"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintController = exports.ComplaintController = void 0;
const complaint_service_1 = require("../services/complaint.service");
const complaintService = new complaint_service_1.ComplaintService();
class ComplaintController {
    // Create Complaint (Public)
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, phone, area, complaintType, details } = req.body;
                // Validation
                if (!name || !phone || !area || !complaintType || !details) {
                    return res.status(400).json({
                        success: false,
                        message: 'সব ফিল্ড পূরণ করুন',
                    });
                }
                const result = yield complaintService.createComplaint({
                    name,
                    phone,
                    area,
                    complaintType,
                    details,
                });
                res.status(201).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Track Complaints (Public)
    track(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = req.body;
                if (!phone) {
                    return res.status(400).json({
                        success: false,
                        message: 'ফোন নম্বর দিন',
                    });
                }
                const result = yield complaintService.trackComplaints({ phone });
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Get All Complaints (Admin)
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield complaintService.getAllComplaints();
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Get Single Complaint (Admin)
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (Array.isArray(id)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid complaint id',
                    });
                }
                const result = yield complaintService.getComplaintById(id);
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Update Status (Admin)
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status, adminNote } = req.body;
                if (Array.isArray(id)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid complaint id',
                    });
                }
                if (!status) {
                    return res.status(400).json({
                        success: false,
                        message: 'Status দিন',
                    });
                }
                const result = yield complaintService.updateComplaintStatus(id, {
                    status,
                    adminNote,
                });
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Delete Complaint (Admin)
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (Array.isArray(id)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid complaint id',
                    });
                }
                const result = yield complaintService.deleteComplaint(id);
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    // Get Stats (Public)
    getStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield complaintService.getStats();
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.ComplaintController = ComplaintController;
// Export instance
exports.complaintController = new ComplaintController();
