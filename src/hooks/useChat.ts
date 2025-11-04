
import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket/client';
import { userJobsApi } from '@/lib/api/user';

export const useChat = (roomId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Fetch initial messages
    userJobsApi.getChatMessages(roomId).then(response => {
      setMessages(response.data.messages);
    });

    // Setup socket
    socketRef.current = getSocket();
    const socket = socketRef.current;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_chat_room', { roomId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_message', (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leave_chat_room', { roomId });
      socket.off('connect');
      socket.off('disconnect';
      socket.off('new_message');
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (message: string) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('send_message', { roomId, message });
    }
  };

  return { messages, sendMessage, isConnected };
};
