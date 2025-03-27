import {io} from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"]  // Use both WebSocket & Polling
});

export default socket;
