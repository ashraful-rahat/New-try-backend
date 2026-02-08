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
exports.ComplaintService = void 0;
const idGenerator_1 = require("../../utils/idGenerator");
const Complaint_model_1 = require("../models/Complaint.model");
class ComplaintService {
    // Create Complaint (Public - No Auth)
    createComplaint(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate unique complaint ID
            const complaintId = yield (0, idGenerator_1.generateComplaintId)();
            // Create complaint
            const complaint = yield Complaint_model_1.ComplaintModel.create(Object.assign(Object.assign({ complaintId }, data), { status: 'pending' }));
            return {
                message: 'অভিযোগ সফলভাবে জমা হয়েছে',
                complaint: Object.assign(Object.assign({}, complaint.toObject()), { _id: complaint._id.toString() }),
            };
        });
    }
    // Track Complaints by Phone (Public - No Auth)
    trackComplaints(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = data;
            const complaints = yield Complaint_model_1.ComplaintModel.find({ phone }).sort({ createdAt: -1 });
            if (complaints.length === 0) {
                throw new Error('এই নম্বরে কোনো অভিযোগ পাওয়া যায়নি');
            }
            return {
                message: 'অভিযোগ খুঁজে পাওয়া গেছে',
                complaints: complaints.map((c) => (Object.assign(Object.assign({}, c.toObject()), { _id: c._id.toString() }))),
            };
        });
    }
    // Get All Complaints (Admin Only)
    getAllComplaints() {
        return __awaiter(this, void 0, void 0, function* () {
            const complaints = yield Complaint_model_1.ComplaintModel.find().sort({ createdAt: -1 });
            return {
                message: 'সব অভিযোগ',
                complaints: complaints.map((c) => (Object.assign(Object.assign({}, c.toObject()), { _id: c._id.toString() }))),
            };
        });
    }
    // Get Single Complaint (Admin Only)
    getComplaintById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const complaint = yield Complaint_model_1.ComplaintModel.findById(id);
            if (!complaint) {
                throw new Error('অভিযোগ পাওয়া যায়নি');
            }
            return {
                message: 'অভিযোগ পাওয়া গেছে',
                complaint: Object.assign(Object.assign({}, complaint.toObject()), { _id: complaint._id.toString() }),
            };
        });
    }
    // Update Complaint Status (Admin Only)
    updateComplaintStatus(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const complaint = yield Complaint_model_1.ComplaintModel.findById(id);
            if (!complaint) {
                throw new Error('অভিযোগ পাওয়া যায়নি');
            }
            // Update status
            complaint.status = data.status;
            complaint.adminNote = data.adminNote || complaint.adminNote;
            // If solved, set solvedAt
            if (data.status === 'solved') {
                complaint.solvedAt = new Date();
            }
            yield complaint.save();
            return {
                message: 'অভিযোগ আপডেট হয়েছে',
                complaint: Object.assign(Object.assign({}, complaint.toObject()), { _id: complaint._id.toString() }),
            };
        });
    }
    // Delete Complaint (Admin Only)
    deleteComplaint(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const complaint = yield Complaint_model_1.ComplaintModel.findByIdAndDelete(id);
            if (!complaint) {
                throw new Error('অভিযোগ পাওয়া যায়নি');
            }
            return {
                message: 'অভিযোগ মুছে ফেলা হয়েছে',
                complaint: Object.assign(Object.assign({}, complaint.toObject()), { _id: complaint._id.toString() }),
            };
        });
    }
    // Get Statistics (Public)
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield Complaint_model_1.ComplaintModel.countDocuments();
            const pending = yield Complaint_model_1.ComplaintModel.countDocuments({ status: 'pending' });
            const solved = yield Complaint_model_1.ComplaintModel.countDocuments({ status: 'solved' });
            return {
                message: 'পরিসংখ্যান',
                stats: {
                    total,
                    pending,
                    solved,
                },
            };
        });
    }
}
exports.ComplaintService = ComplaintService;
