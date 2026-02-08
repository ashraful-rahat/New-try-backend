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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const Admin_model_1 = require("../models/Admin.model");
class AuthService {
    // Register a new user
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const existingUser = yield Admin_model_1.AdminModel.findOne({ email });
            if (existingUser)
                throw new Error('User already exists');
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Determine role: first user = admin
            const isFirstUser = (yield Admin_model_1.AdminModel.countDocuments()) === 0;
            const role = isFirstUser ? 'admin' : 'member';
            const user = yield Admin_model_1.AdminModel.create({ email, password: hashedPassword, role });
            const token = (0, jwt_1.generateToken)(user._id.toString(), user.email, user.role);
            return {
                message: 'Registration successful',
                admin: { id: user._id.toString(), email: user.email, role: user.role },
                token,
            };
        });
    }
    // Login user
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield Admin_model_1.AdminModel.findOne({ email });
            if (!user)
                throw new Error('Invalid credentials');
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid)
                throw new Error('Invalid credentials');
            const token = (0, jwt_1.generateToken)(user._id.toString(), user.email, user.role);
            return {
                message: 'Login successful',
                admin: { id: user._id.toString(), email: user.email, role: user.role },
                token,
            };
        });
    }
}
exports.AuthService = AuthService;
