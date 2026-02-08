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
exports.campaignController = exports.removeImageFromCampaign = exports.addImagesToCampaign = exports.getCampaignStats = exports.deleteCampaign = exports.updateCampaignStatus = exports.updateCampaign = exports.getCampaignById = exports.getActiveCampaigns = exports.getAllCampaigns = exports.createCampaign = void 0;
const multer_1 = require("../middleware/multer");
const campaign_service_1 = require("../services/campaign.service");
const campaignService = new campaign_service_1.CampaignService();
// =======================
// Helpers
// =======================
const validateCampaignData = (data) => {
    if (!data.title || !data.description || !data.category || !data.type || !data.startDate) {
        return 'টাইটেল, বিবরণ, ক্যাটাগরি, টাইপ এবং শুরুর তারিখ দিন';
    }
    if (data.title.length < 5) {
        return 'টাইটেল ৫ অক্ষরের বেশি হতে হবে';
    }
    if (data.description.length < 20) {
        return 'বিবরণ ২০ অক্ষরের বেশি হতে হবে';
    }
    return null;
};
const getStringParam = (param) => {
    if (Array.isArray(param))
        return param[0];
    return param;
};
// =======================
// Create Campaign
// =======================
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = req.files;
        const images = [];
        if (uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.length) {
            uploadedFiles.forEach((file, index) => {
                const imageData = (0, multer_1.getCloudinaryImageData)(file);
                images.push({
                    url: imageData.url,
                    publicId: imageData.publicId,
                    order: index,
                });
            });
        }
        const campaignData = {
            title: req.body.title,
            description: req.body.description,
            images,
            category: req.body.category,
            type: req.body.type, // VOLUNTEER | EVENT | SOCIAL_ACTIVITY
            startDate: new Date(req.body.startDate),
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            location: req.body.location,
            volunteerLimit: req.body.volunteerLimit ? parseInt(req.body.volunteerLimit) : undefined,
            priority: req.body.priority ? parseInt(req.body.priority) : 0,
        };
        const validationError = validateCampaignData(campaignData);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }
        // TODO: Replace with real admin from auth middleware
        const createdBy = '65a1b2c3d4e5f67890abcdef';
        const result = yield campaignService.createCampaign(campaignData, createdBy);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('❌ Create Campaign Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে',
        });
    }
});
exports.createCampaign = createCampaign;
// =======================
// Get All Campaigns
// =======================
const getAllCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.query.status;
        const type = req.query.type;
        const result = yield campaignService.getAllCampaigns(status, type);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'ক্যাম্পেইন গুলো পাওয়া যায়নি',
        });
    }
});
exports.getAllCampaigns = getAllCampaigns;
// =======================
// Get Active / Ongoing Campaigns
// =======================
const getActiveCampaigns = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield campaignService.getActiveCampaigns();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'সক্রিয় ক্যাম্পেইন পাওয়া যায়নি',
        });
    }
});
exports.getActiveCampaigns = getActiveCampaigns;
// =======================
// Get Single Campaign
// =======================
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const result = yield campaignService.getCampaignById(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
        });
    }
});
exports.getCampaignById = getCampaignById;
// =======================
// Update Campaign
// =======================
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const uploadedFiles = req.files;
        let images;
        if (uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.length) {
            images = uploadedFiles.map((file, index) => {
                const imageData = (0, multer_1.getCloudinaryImageData)(file);
                return {
                    url: imageData.url,
                    publicId: imageData.publicId,
                    order: index,
                };
            });
        }
        const updateData = Object.assign({}, req.body);
        if (images)
            updateData.images = images;
        if (updateData.startDate)
            updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate)
            updateData.endDate = new Date(updateData.endDate);
        if (updateData.volunteerLimit)
            updateData.volunteerLimit = parseInt(updateData.volunteerLimit);
        if (updateData.priority)
            updateData.priority = parseInt(updateData.priority);
        const result = yield campaignService.updateCampaign(id, updateData);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'ক্যাম্পেইন আপডেট করা যায়নি',
        });
    }
});
exports.updateCampaign = updateCampaign;
// =======================
// Update Campaign Status
// =======================
const updateCampaignStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'স্ট্যাটাস দিন',
            });
        }
        const result = yield campaignService.updateCampaignStatus(id, status);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'স্ট্যাটাস আপডেট করা যায়নি',
        });
    }
});
exports.updateCampaignStatus = updateCampaignStatus;
// =======================
// Delete Campaign
// =======================
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const result = yield campaignService.deleteCampaign(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'ক্যাম্পেইন ডিলিট করা যায়নি',
        });
    }
});
exports.deleteCampaign = deleteCampaign;
// =======================
// Campaign Statistics (NO MONEY)
// =======================
const getCampaignStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield campaignService.getCampaignStats();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'স্ট্যাটস পাওয়া যায়নি',
        });
    }
});
exports.getCampaignStats = getCampaignStats;
// =======================
// Add Images
// =======================
const addImagesToCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const uploadedFiles = req.files;
        if (!(uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.length)) {
            return res.status(400).json({
                success: false,
                message: 'কমপক্ষে একটি ইমেজ দিন',
            });
        }
        const images = uploadedFiles.map((file, index) => {
            const imageData = (0, multer_1.getCloudinaryImageData)(file);
            return {
                url: imageData.url,
                publicId: imageData.publicId,
                order: index,
            };
        });
        const result = yield campaignService.addImagesToCampaign(id, images);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'ইমেজ যোগ করা যায়নি',
        });
    }
});
exports.addImagesToCampaign = addImagesToCampaign;
// =======================
// Remove Image
// =======================
const removeImageFromCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getStringParam(req.params.id);
        const publicId = getStringParam(req.params.publicId);
        const result = yield campaignService.removeImageFromCampaign(id, publicId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'ইমেজ মুছা যায়নি',
        });
    }
});
exports.removeImageFromCampaign = removeImageFromCampaign;
// =======================
// Export
// =======================
exports.campaignController = {
    create: exports.createCampaign,
    getAll: exports.getAllCampaigns,
    getActive: exports.getActiveCampaigns,
    getById: exports.getCampaignById,
    update: exports.updateCampaign,
    updateStatus: exports.updateCampaignStatus,
    delete: exports.deleteCampaign,
    getStats: exports.getCampaignStats,
    addImages: exports.addImagesToCampaign,
    removeImage: exports.removeImageFromCampaign,
};
