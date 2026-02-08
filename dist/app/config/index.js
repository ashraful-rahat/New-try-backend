"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const config = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL || 'mongodb://localhost:27017/campaign-db',
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
    },
    jwt_secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    base_url: process.env.BASE_URL || 'http://localhost:5000',
    node_env: process.env.NODE_ENV || 'development',
};
// Validate Cloudinary config
if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
    console.warn('⚠️ Cloudinary environment variables are missing. Image upload may not work properly.');
}
exports.default = config;
