"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = () => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ success: false, message: 'No token provided' });
        const token = authHeader.split(' ')[1];
        if (!token)
            return res.status(401).json({ success: false, message: 'No token provided' });
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.admin = decoded;
            next();
        }
        catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    };
};
exports.authenticate = authenticate;
// Optional middleware to allow only admins
const adminOnly = (req, res, next) => {
    const user = req.admin;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
};
exports.adminOnly = adminOnly;
