import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import complaintRoutes from './routes/complaint.routes';
import noticeRoutes from './routes/notice.routes';

const app: Application = express();

// ===== CORS Setup =====
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return callback(null, true); // curl, Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by origin'));
    }
  },
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

export default app;
