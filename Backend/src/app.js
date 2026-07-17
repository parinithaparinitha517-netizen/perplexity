import express from 'express';
import cookieParser from 'cookie-parser';
import errorhandle from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const isLocalDevelopmentOrigin = (origin) => {
    if (process.env.NODE_ENV === 'production') return false;

    try {
        const url = new URL(origin);
        return url.protocol === 'http:'
            && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
    } catch {
        return false;
    }
};

app.use(cors({
    origin(origin, callback) {
        if (!origin || origin === configuredOrigin) {
            return callback(null, true);
        }

        if (isLocalDevelopmentOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/auth/api', authRoutes);
// Backward compatibility for older frontend builds that used /api/auth.
app.use('/api/auth', authRoutes);
app.use('/chat/api', chatRoutes);
app.use(errorhandle);

export default app;
