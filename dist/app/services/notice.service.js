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
exports.NoticeService = void 0;
const Notice_model_1 = require("../models/Notice.model");
class NoticeService {
    // Convert to response object
    toResponseObject(doc) {
        return {
            _id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            date: doc.date,
            time: doc.time || '',
            location: doc.location,
            type: doc.type,
            priority: doc.priority,
            createdAt: doc.createdAt,
        };
    }
    // Create Notice
    createNotice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_model_1.NoticeModel.create(data);
                return {
                    success: true,
                    message: 'নোটিশ তৈরি হয়েছে',
                    notice: this.toResponseObject(notice),
                };
            }
            catch (error) {
                throw new Error(error.message || 'নোটিশ তৈরি করতে সমস্যা');
            }
        });
    }
    // Get All Notices
    getAllNotices(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                if (type)
                    query.type = type;
                const notices = yield Notice_model_1.NoticeModel.find(query).sort({ date: -1, priority: -1 });
                return {
                    success: true,
                    message: 'সব নোটিশ',
                    notices: notices.map((notice) => this.toResponseObject(notice)),
                };
            }
            catch (error) {
                throw new Error(error.message || 'নোটিশ পাওয়া যায়নি');
            }
        });
    }
    // Get Today's Notices
    getTodayNotices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const notices = yield Notice_model_1.NoticeModel.find({
                    date: { $gte: today, $lt: tomorrow },
                }).sort({ priority: -1, createdAt: -1 });
                return {
                    success: true,
                    message: 'আজকের নোটিশ',
                    notices: notices.map((notice) => this.toResponseObject(notice)),
                };
            }
            catch (error) {
                throw new Error(error.message || 'আজকের নোটিশ পাওয়া যায়নি');
            }
        });
    }
    // Get Upcoming Notices
    getUpcomingNotices() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const notices = yield Notice_model_1.NoticeModel.find({
                    date: { $gte: today },
                })
                    .sort({ date: 1, priority: -1 })
                    .limit(limit);
                return {
                    success: true,
                    message: 'আসন্ন নোটিশ',
                    notices: notices.map((notice) => this.toResponseObject(notice)),
                };
            }
            catch (error) {
                throw new Error(error.message || 'আসন্ন নোটিশ পাওয়া যায়নি');
            }
        });
    }
    // Get Important Notices
    getImportantNotices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notices = yield Notice_model_1.NoticeModel.find({ type: 'important' })
                    .sort({ date: -1, priority: -1 })
                    .limit(20);
                return {
                    success: true,
                    message: 'গুরুত্বপূর্ণ নোটিশ',
                    notices: notices.map((notice) => this.toResponseObject(notice)),
                };
            }
            catch (error) {
                throw new Error(error.message || 'গুরুত্বপূর্ণ নোটিশ পাওয়া যায়নি');
            }
        });
    }
    // Get Single Notice
    getNoticeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_model_1.NoticeModel.findById(id);
                if (!notice) {
                    throw new Error('নোটিশ পাওয়া যায়নি');
                }
                return {
                    success: true,
                    message: 'নোটিশ পাওয়া গেছে',
                    notice: this.toResponseObject(notice),
                };
            }
            catch (error) {
                throw new Error(error.message || 'নোটিশ পাওয়া যায়নি');
            }
        });
    }
    // Update Notice
    updateNotice(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_model_1.NoticeModel.findByIdAndUpdate(id, data, { new: true });
                if (!notice) {
                    throw new Error('নোটিশ পাওয়া যায়নি');
                }
                return {
                    success: true,
                    message: 'নোটিশ আপডেট হয়েছে',
                    notice: this.toResponseObject(notice),
                };
            }
            catch (error) {
                throw new Error(error.message || 'নোটিশ আপডেট করতে সমস্যা');
            }
        });
    }
    // Delete Notice
    deleteNotice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notice = yield Notice_model_1.NoticeModel.findByIdAndDelete(id);
                if (!notice) {
                    throw new Error('নোটিশ পাওয়া যায়নি');
                }
                return {
                    success: true,
                    message: 'নোটিশ ডিলিট হয়েছে',
                };
            }
            catch (error) {
                throw new Error(error.message || 'নোটিশ ডিলিট করতে সমস্যা');
            }
        });
    }
}
exports.NoticeService = NoticeService;
