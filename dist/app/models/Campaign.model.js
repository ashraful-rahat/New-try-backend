"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// =======================
// Campaign Image Schema
// =======================
const CampaignImageSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
});
// =======================
// Campaign Schema (POLITICAL SAFE)
// =======================
const CampaignSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'টাইটেল আবশ্যক'],
        trim: true,
        minlength: [5, 'টাইটেল ৫ অক্ষরের বেশি হতে হবে'],
        maxlength: [200, 'টাইটেল ২০০ অক্ষরের কম হতে হবে'],
    },
    description: {
        type: String,
        required: [true, 'বিবরণ আবশ্যক'],
        minlength: [20, 'বিবরণ ২০ অক্ষরের বেশি হতে হবে'],
    },
    images: {
        type: [CampaignImageSchema],
        default: [],
    },
    category: {
        type: String,
        required: [true, 'ক্যাটাগরি আবশ্যক'],
        enum: ['শিক্ষা', 'স্বাস্থ্য', 'পরিবেশ', 'যুব উন্নয়ন', 'সামাজিক কার্যক্রম', 'অন্যান্য'],
    },
    type: {
        type: String,
        enum: ['VOLUNTEER', 'EVENT', 'SOCIAL_ACTIVITY'],
        required: true,
    },
    startDate: {
        type: Date,
        required: [true, 'শুরুর তারিখ আবশ্যক'],
    },
    endDate: {
        type: Date,
    },
    location: {
        type: String,
        trim: true,
    },
    volunteerLimit: {
        type: Number,
        min: [1, 'ভলান্টিয়ার লিমিট ১ বা তার বেশি হতে হবে'],
    },
    registeredVolunteers: {
        type: Number,
        default: 0,
        min: [0, 'ভলান্টিয়ার সংখ্যা ০ বা তার বেশি হতে হবে'],
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
        default: 'UPCOMING',
    },
    priority: {
        type: Number,
        min: [0, 'প্রায়োরিটি ০ বা তার বেশি হতে হবে'],
        max: [10, 'প্রায়োরিটি ১০ বা তার কম হতে হবে'],
        default: 0,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, {
    timestamps: true,
});
// =======================
// Indexes
// =======================
CampaignSchema.index({ status: 1, priority: -1, createdAt: -1 });
CampaignSchema.index({ category: 1 });
CampaignSchema.index({ type: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });
// =======================
// Model Export
// =======================
exports.CampaignModel = mongoose_1.default.model('Campaign', CampaignSchema);
