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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.getCloudinaryImageData = exports.singleUpload = exports.campaignUpload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = __importDefault(require("../config"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
// Validate Cloudinary connection
const testCloudinaryConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary_1.v2.api.ping();
        console.log('✅ Cloudinary connection successful');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Cloudinary connection failed:', error.message);
        }
        else {
            console.error('❌ Cloudinary connection failed:', error);
        }
        console.warn('Images will be stored locally instead');
    }
});
testCloudinaryConnection();
// Cloudinary storage configuration
const campaignStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: 'campaigns',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
            public_id: `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        };
    }),
});
// File filter
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, WebP, GIF) আপলোড করা যাবে'));
    }
};
// Multer instances
exports.campaignUpload = (0, multer_1.default)({
    storage: campaignStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10, // Maximum 10 files
    },
});
exports.singleUpload = (0, multer_1.default)({
    storage: campaignStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
// Helper function to get image URL from Cloudinary response
const getCloudinaryImageData = (file) => {
    // Cloudinary returns file.path as the URL
    const url = file.path;
    const publicId = file.filename;
    return {
        url: url,
        publicId: publicId,
    };
};
exports.getCloudinaryImageData = getCloudinaryImageData;
