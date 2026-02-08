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
exports.CampaignService = void 0;
const multer_1 = require("../middleware/multer");
const Campaign_model_1 = require("../models/Campaign.model");
class CampaignService {
    // =======================
    // Helper: format response (FIXED)
    // =======================
    toResponseObject(doc) {
        var _a, _b, _c, _d, _e, _f;
        // ✅ Return empty object instead of null
        if (!doc) {
            console.warn('⚠️ Warning: null document passed to toResponseObject');
            return this.getEmptyCampaign();
        }
        const obj = doc.toObject ? doc.toObject() : doc;
        // ✅ Add defensive checks for all required fields
        return {
            _id: ((_a = obj._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            title: obj.title || '',
            description: obj.description || '',
            images: obj.images || [],
            category: obj.category || '',
            type: obj.type || 'VOLUNTEER',
            startDate: obj.startDate || new Date(),
            endDate: obj.endDate,
            location: obj.location || '',
            volunteerLimit: obj.volunteerLimit,
            registeredVolunteers: obj.registeredVolunteers || 0,
            status: obj.status || 'UPCOMING',
            priority: obj.priority || 0,
            createdBy: {
                _id: ((_c = (_b = obj.createdBy) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) ||
                    (typeof obj.createdBy === 'string' ? obj.createdBy : ''),
                name: ((_d = obj.createdBy) === null || _d === void 0 ? void 0 : _d.name) || '',
                email: ((_e = obj.createdBy) === null || _e === void 0 ? void 0 : _e.email) || '',
                role: ((_f = obj.createdBy) === null || _f === void 0 ? void 0 : _f.role) || 'ADMIN', // ✅ Added missing role
            },
            createdAt: obj.createdAt || new Date(),
            updatedAt: obj.updatedAt || new Date(),
        };
    }
    // =======================
    // Helper: Get empty campaign object
    // =======================
    getEmptyCampaign() {
        return {
            _id: '',
            title: '',
            description: '',
            images: [],
            category: '',
            type: 'VOLUNTEER',
            startDate: new Date(),
            endDate: undefined,
            location: '',
            volunteerLimit: undefined,
            registeredVolunteers: 0,
            status: 'UPCOMING',
            priority: 0,
            createdBy: {
                _id: '',
                name: '',
                email: '',
                role: 'ADMIN',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    // =======================
    // Create Campaign
    // =======================
    createCampaign(data, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_model_1.CampaignModel.create(Object.assign(Object.assign({}, data), { createdBy, status: 'UPCOMING', registeredVolunteers: 0, priority: data.priority || 0 }));
                return {
                    success: true,
                    message: 'ক্যাম্পেইন সফলভাবে তৈরি হয়েছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error creating campaign:', error);
                throw new Error(error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে');
            }
        });
    }
    // =======================
    // Get All Campaigns (FIXED)
    // =======================
    getAllCampaigns(status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                if (status)
                    query.status = status;
                if (type)
                    query.type = type;
                const campaigns = yield Campaign_model_1.CampaignModel.find(query)
                    .sort({ priority: -1, createdAt: -1 })
                    .populate('createdBy', 'name email role'); // ✅ Added role to populate
                // ✅ Return empty array instead of filtering nulls
                const responseObjects = campaigns.map((c) => this.toResponseObject(c));
                return {
                    success: true,
                    message: responseObjects.length ? 'সব ক্যাম্পেইন' : 'কোনো ক্যাম্পেইন নেই',
                    campaigns: responseObjects,
                };
            }
            catch (error) {
                console.error('Error getting campaigns:', error);
                return {
                    success: false,
                    message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
                    campaigns: [],
                };
            }
        });
    }
    // =======================
    // Get Active / Ongoing (FIXED)
    // =======================
    getActiveCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaigns = yield Campaign_model_1.CampaignModel.find({
                    status: 'ONGOING',
                })
                    .sort({ priority: -1, createdAt: -1 })
                    .populate('createdBy', 'name email role'); // ✅ Added role
                const responseObjects = campaigns.map((c) => this.toResponseObject(c));
                return {
                    success: true,
                    message: 'চলমান ক্যাম্পেইন',
                    campaigns: responseObjects,
                };
            }
            catch (error) {
                console.error('Error getting active campaigns:', error);
                return {
                    success: false,
                    message: error.message || 'সক্রিয় ক্যাম্পেইন পাওয়া যায়নি',
                    campaigns: [],
                };
            }
        });
    }
    // =======================
    // Get Single Campaign (FIXED)
    // =======================
    getCampaignById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_model_1.CampaignModel.findById(id).populate('createdBy', 'name email role'); // ✅ Added role
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                return {
                    success: true,
                    message: 'ক্যাম্পেইন পাওয়া গেছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error getting campaign:', error);
                return {
                    success: false,
                    message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
                };
            }
        });
    }
    // =======================
    // Update Campaign (FIXED)
    // =======================
    updateCampaign(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if ((_a = data.images) === null || _a === void 0 ? void 0 : _a.length) {
                    const existing = yield Campaign_model_1.CampaignModel.findById(id);
                    if ((_b = existing === null || existing === void 0 ? void 0 : existing.images) === null || _b === void 0 ? void 0 : _b.length) {
                        yield this.deleteImagesFromCloudinary(existing.images);
                    }
                }
                const campaign = yield Campaign_model_1.CampaignModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('createdBy', 'name email role'); // ✅ Added role
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                return {
                    success: true,
                    message: 'ক্যাম্পেইন আপডেট হয়েছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error updating campaign:', error);
                return {
                    success: false,
                    message: error.message || 'ক্যাম্পেইন আপডেট করা যায়নি',
                };
            }
        });
    }
    // =======================
    // Update Campaign Status (FIXED)
    // =======================
    updateCampaignStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
                if (!validStatuses.includes(status)) {
                    return {
                        success: false,
                        message: 'অবৈধ স্ট্যাটাস',
                    };
                }
                const campaign = yield Campaign_model_1.CampaignModel.findByIdAndUpdate(id, { status }, { new: true }).populate('createdBy', 'name email role'); // ✅ Added role
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                return {
                    success: true,
                    message: 'স্ট্যাটাস আপডেট হয়েছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error updating status:', error);
                return {
                    success: false,
                    message: error.message || 'স্ট্যাটাস আপডেট করা যায়নি',
                };
            }
        });
    }
    // =======================
    // Delete Campaign (FIXED)
    // =======================
    deleteCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_model_1.CampaignModel.findById(id);
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                if (campaign.images.length) {
                    yield this.deleteImagesFromCloudinary(campaign.images);
                }
                yield campaign.deleteOne();
                return {
                    success: true,
                    message: 'ক্যাম্পেইন মুছে ফেলা হয়েছে',
                };
            }
            catch (error) {
                console.error('Error deleting campaign:', error);
                return {
                    success: false,
                    message: error.message || 'ক্যাম্পেইন ডিলিট করা যায়নি',
                };
            }
        });
    }
    // =======================
    // Campaign Statistics (FIXED)
    // =======================
    getCampaignStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield Campaign_model_1.CampaignModel.countDocuments();
                const upcoming = yield Campaign_model_1.CampaignModel.countDocuments({ status: 'UPCOMING' });
                const ongoing = yield Campaign_model_1.CampaignModel.countDocuments({ status: 'ONGOING' });
                const completed = yield Campaign_model_1.CampaignModel.countDocuments({ status: 'COMPLETED' });
                const cancelled = yield Campaign_model_1.CampaignModel.countDocuments({ status: 'CANCELLED' });
                return {
                    success: true,
                    message: 'ক্যাম্পেইন পরিসংখ্যান',
                    stats: {
                        total,
                        upcoming,
                        ongoing,
                        completed,
                        cancelled,
                    },
                };
            }
            catch (error) {
                console.error('Error getting stats:', error);
                return {
                    success: false,
                    message: error.message || 'পরিসংখ্যান পাওয়া যায়নি',
                    stats: {
                        total: 0,
                        upcoming: 0,
                        ongoing: 0,
                        completed: 0,
                        cancelled: 0,
                    },
                };
            }
        });
    }
    // =======================
    // Cloudinary Cleanup
    // =======================
    deleteImagesFromCloudinary(images) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const image of images) {
                if (image.publicId) {
                    try {
                        yield multer_1.cloudinary.uploader.destroy(image.publicId);
                    }
                    catch (_a) {
                        // ignore individual failures
                    }
                }
            }
        });
    }
    // =======================
    // Add Images (FIXED)
    // =======================
    addImagesToCampaign(id, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_model_1.CampaignModel.findById(id);
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                const newImages = images.map((img, i) => (Object.assign(Object.assign({}, img), { order: campaign.images.length + i })));
                campaign.images.push(...newImages);
                yield campaign.save();
                return {
                    success: true,
                    message: 'ইমেজ যোগ করা হয়েছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error adding images:', error);
                return {
                    success: false,
                    message: error.message || 'ইমেজ যোগ করা যায়নি',
                };
            }
        });
    }
    // =======================
    // Remove Image (FIXED)
    // =======================
    removeImageFromCampaign(id, publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaign_model_1.CampaignModel.findById(id);
                if (!campaign) {
                    return {
                        success: false,
                        message: 'ক্যাম্পেইন পাওয়া যায়নি',
                    };
                }
                const index = campaign.images.findIndex((img) => img.publicId === publicId);
                if (index === -1) {
                    return {
                        success: false,
                        message: 'ইমেজ পাওয়া যায়নি',
                    };
                }
                yield multer_1.cloudinary.uploader.destroy(publicId);
                campaign.images.splice(index, 1);
                campaign.images.forEach((img, i) => (img.order = i));
                yield campaign.save();
                return {
                    success: true,
                    message: 'ইমেজ মুছে ফেলা হয়েছে',
                    campaign: this.toResponseObject(campaign),
                };
            }
            catch (error) {
                console.error('Error removing image:', error);
                return {
                    success: false,
                    message: error.message || 'ইমেজ মুছতে সমস্যা হয়েছে',
                };
            }
        });
    }
}
exports.CampaignService = CampaignService;
