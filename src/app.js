import express from 'express';
import cookieParser from 'cookie-parser';
import errorhandle from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/auth/api', authRoutes);
app.use(errorhandle);

export default app;