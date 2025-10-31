import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (socket) return socket;
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  socket = io(baseURL, {
    autoConnect: false,
    transports: ['websocket'], // avoid polling SID issues
    path: '/socket.io',
    auth: accessToken ? { token: accessToken } : undefined,
    withCredentials: true,
  });
  return socket;
};

export default getSocket;


