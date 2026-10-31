import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Builder API is active', timestamp: new Date() });
});

app.use('/api/users', userRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/ai', aiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
