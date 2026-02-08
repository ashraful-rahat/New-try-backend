"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.registerAdmin);
router.post('/login', auth_controller_1.loginAdmin);
// Protected route
router.get('/check', (0, auth_middleware_1.authenticate)(), auth_controller_1.checkAuth);
exports.default = router;
