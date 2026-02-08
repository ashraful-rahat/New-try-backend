import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import connectDB from './db';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import complaintRoutes from './routes/complaint.routes';
import noticeRoutes from './routes/notice.routes';

const app: Application = express();

// ===== Database Connection =====
connectDB().catch((err) => console.error('DB Connection Error:', err));

// ===== CORS Setup =====
const allowedOrigins = ['http://localhost:3000', 'https://feni-2-frontend.vercel.app'];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 🟢 Add this
  allowedHeaders: ['Content-Type', 'Authorization'], // 🟢 Add this
};

app.use(cors(corsOptions));

// ===== Middleware =====
app.use(express.json());

// ===== Routes =====
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/notices', noticeRoutes);

// ===== Root Route =====
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Feni-2 Backend!',
  });
});

// ===== 404 Handler =====
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
