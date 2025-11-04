import { createContext, useContext, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import getSocket from '@/lib/socket/client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    if (socket) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('new_notification', (data: { title: string; message: string }) => {
        toast.info(data.title, {
          description: data.message,
        });
      });

      return () => {
        socket.off('connect');
        socket.off('new_notification');
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
