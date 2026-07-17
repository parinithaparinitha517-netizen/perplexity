import { Server } from 'socket.io';
let io
export function initSocket(Httpserver) {
    const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    const allowOrigin = (origin, callback) => {
        if (!origin || origin === configuredOrigin) {
            return callback(null, true);
        }

        if (process.env.NODE_ENV !== 'production') {
            try {
                const url = new URL(origin);
                if (url.protocol === 'http:'
                    && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
                    return callback(null, true);
                }
            } catch {
                // Invalid origins are rejected below.
            }
        }

        return callback(new Error('Origin not allowed by CORS'));
    };

    io = new Server(Httpserver, {
        cors: {
            origin: allowOrigin,
            credentials: true//bcz cookie data is needed to be sent to the server for authentication
        }
    })
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

    })
}
export function getSocket() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io
} 
