
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api/auth';

interface ChatWindowProps {
  roomId: string;
}

export const ChatWindow = ({ roomId }: ChatWindowProps) => {
  const { messages, sendMessage, isConnected } = useChat(roomId);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = authApi.getCurrentUser();

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === currentUser?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};
