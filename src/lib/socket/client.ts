import { io, Socket } from 'socket.io-client';
import { authApi } from '@/lib/api/auth';

const URL = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:8000';

const getSocket = (): Socket => {
  const token = authApi.getAccessToken();

  const socket = io(URL, {
    autoConnect: false,
    auth: {
      token: token ? `${token}` : ''
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    if (err.message === 'Authentication error') {
      // Handle auth error, e.g., by logging out the user
      authApi.logout();
      window.location.href = '/login';
    }
  });

  return socket;
};

export default getSocket;
