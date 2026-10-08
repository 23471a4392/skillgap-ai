import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import skillsRoutes from './routes/skills';
import rolesRoutes from './routes/roles';
import analysisRoutes from './routes/analysis';
import roadmapRoutes from './routes/roadmap';
import progressRoutes from './routes/progress';
import applicationsRoutes from './routes/applications';
import resumeRoutes from './routes/resume';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Logging Middlewares
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '5mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SkillGap AI Core Engine',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/resume', resumeRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 SkillGap AI API server listening on http://0.0.0.0:${PORT}`);
});

export default app;
