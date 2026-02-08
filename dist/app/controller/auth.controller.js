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
exports.checkAuth = exports.loginAdmin = exports.registerAdmin = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email এবং password দিন' });
        }
        const result = yield authService.register({ email, password });
        res.status(201).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email এবং password দিন' });
        }
        const result = yield authService.login({ email, password });
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'ভুল email বা password' });
    }
});
exports.loginAdmin = loginAdmin;
const checkAuth = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authenticated',
        admin: req.admin, // JWT decoded user
    });
};
exports.checkAuth = checkAuth;
