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
exports.noticeController = exports.deleteNotice = exports.updateNotice = exports.getNoticeById = exports.getImportantNotices = exports.getUpcomingNotices = exports.getTodayNotices = exports.getAllNotices = exports.createNotice = void 0;
const notice_service_1 = require("../services/notice.service");
const noticeService = new notice_service_1.NoticeService();
// Create Notice
const createNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, date, time, location, type, priority } = req.body;
        // Simple validation
        if (!title || !description || !date || !location) {
            return res.status(400).json({
                success: false,
                message: 'শিরোনাম, বিবরণ, তারিখ এবং লোকেশন দিন',
            });
        }
        const noticeData = {
            title,
            description,
            date: new Date(date),
            time: time || '',
            location,
            type: type || 'daily',
            priority: priority ? parseInt(String(priority)) : 0,
        };
        const result = yield noticeService.createNotice(noticeData);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating notice:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'নোটিশ তৈরি করতে সমস্যা হয়েছে',
        });
    }
});
exports.createNotice = createNotice;
// Get All Notices
const getAllNotices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type;
        const result = yield noticeService.getAllNotices(type);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting all notices:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'নোটিশ গুলো পাওয়া যায়নি',
        });
    }
});
exports.getAllNotices = getAllNotices;
// Get Today's Notices
const getTodayNotices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield noticeService.getTodayNotices();
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error getting today's notices:", error);
        res.status(400).json({
            success: false,
            message: error.message || 'আজকের নোটিশ পাওয়া যায়নি',
        });
    }
});
exports.getTodayNotices = getTodayNotices;
// Get Upcoming Notices
const getUpcomingNotices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limitParam = req.query.limit;
        const limit = limitParam ? parseInt(String(limitParam)) : 10; // ✅ Fixed
        const result = yield noticeService.getUpcomingNotices(limit);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting upcoming notices:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'আসন্ন নোটিশ পাওয়া যায়নি',
        });
    }
});
exports.getUpcomingNotices = getUpcomingNotices;
// Get Important Notices
const getImportantNotices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield noticeService.getImportantNotices();
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting important notices:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'গুরুত্বপূর্ণ নোটিশ পাওয়া যায়নি',
        });
    }
});
exports.getImportantNotices = getImportantNotices;
// Get Single Notice - ✅ FIXED: Using String() constructor
const getNoticeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id); // ✅ Fixed: Convert to string
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'নোটিশ আইডি দিন',
            });
        }
        const result = yield noticeService.getNoticeById(id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting notice by ID:', error);
        const status = error.message === 'নোটিশ পাওয়া যায়নি' ? 404 : 400;
        res.status(status).json({
            success: false,
            message: error.message || 'নোটিশ পাওয়া যায়নি',
        });
    }
});
exports.getNoticeById = getNoticeById;
// Update Notice - ✅ FIXED: Using String() constructor
const updateNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id); // ✅ Fixed: Convert to string
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'নোটিশ আইডি দিন',
            });
        }
        const updateData = Object.assign({}, req.body);
        // Convert date if present
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        // Convert priority to number if present
        if (updateData.priority !== undefined) {
            updateData.priority = parseInt(String(updateData.priority));
        }
        const result = yield noticeService.updateNotice(id, updateData);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error updating notice:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'নোটিশ আপডেট করতে সমস্যা হয়েছে',
        });
    }
});
exports.updateNotice = updateNotice;
// Delete Notice - ✅ FIXED: Using String() constructor
const deleteNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id); // ✅ Fixed: Convert to string
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'নোটিশ আইডি দিন',
            });
        }
        const result = yield noticeService.deleteNotice(id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error deleting notice:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'নোটিশ ডিলিট করতে সমস্যা হয়েছে',
        });
    }
});
exports.deleteNotice = deleteNotice;
// Export controller object
exports.noticeController = {
    create: exports.createNotice,
    getAll: exports.getAllNotices,
    getToday: exports.getTodayNotices,
    getUpcoming: exports.getUpcomingNotices,
    getImportant: exports.getImportantNotices,
    getById: exports.getNoticeById,
    update: exports.updateNotice,
    delete: exports.deleteNotice,
};
