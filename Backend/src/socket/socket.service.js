import { Server } from 'socket.io';
let io
export function initSocket(Httpserver) {
    io = new Server(Httpserver, {
        cors: {
            origin: 'http://localhost:5173',
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
