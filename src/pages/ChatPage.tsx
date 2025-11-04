
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { userJobsApi } from '@/lib/api/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ChatPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: userJobsApi.getChatRooms,
  });

  const rooms = data?.data?.chatRooms || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Loading conversations...</p>}
              {!isLoading && rooms.length === 0 && <p>No conversations yet.</p>}
              <div className="space-y-4">
                {rooms.map((room: any) => (
                  <div 
                    key={room.id} 
                    className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => navigate(`/chat/${room.id}`)}
                  >
                    <p className="font-semibold">{room.job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {room.participants.map((p: any) => p.firstName).join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {room.messages[0]?.message || 'No messages yet'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
