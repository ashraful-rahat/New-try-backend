"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const complaint_routes_1 = __importDefault(require("./routes/complaint.routes"));
const notice_routes_1 = __importDefault(require("./routes/notice.routes"));
const app = (0, express_1.default)();
// ===== Database Connection =====
(0, db_1.default)().catch((err) => console.error('DB Connection Error:', err));
// ===== CORS Setup =====
const allowedOrigins = ['http://localhost:3000', 'https://feni-2-frontend.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 🟢 Add this
    allowedHeaders: ['Content-Type', 'Authorization'], // 🟢 Add this
};
app.use((0, cors_1.default)(corsOptions));
// ===== Middleware =====
app.use(express_1.default.json());
// ===== Routes =====
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/complaints', complaint_routes_1.default);
app.use('/api/v1/campaigns', campaign_routes_1.default);
app.use('/api/v1/notices', notice_routes_1.default);
// ===== Root Route =====
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Feni-2 Backend!',
    });
});
// ===== 404 Handler =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});
exports.default = app;
