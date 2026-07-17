import {io} from 'socket.io-client'

const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Include credentials for authentication
export function connectSocket() {
const socket = io(serverUrl, { withCredentials: true })

socket.on('connect', () => {
  console.log('Connected to server');
})

return socket;
}
