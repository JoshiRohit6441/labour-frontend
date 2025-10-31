import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userNotificationsApi } from '@/lib/api/user';

const UserNotifications = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['user-notifications', 1],
    queryFn: () => userNotificationsApi.list(1, 20),
  });

  const items = data?.data?.items || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted-foreground">No notifications.</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={async () => {
                      await userNotificationsApi.markAllRead();
                      qc.invalidateQueries({ queryKey: ['user-notifications', 1] });
                    }}>Mark all read</Button>
                  </div>
                  {items.map((n: any) => (
                    <div key={n.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{n.title || 'Notification'}</p>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                      </div>
                      <div className="flex gap-2">
                        {!n.read && (
                          <Button size="sm" variant="secondary" onClick={async () => {
                            await userNotificationsApi.markAsRead(n.id);
                            qc.invalidateQueries({ queryKey: ['user-notifications', 1] });
                          }}>Read</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={async () => {
                          await userNotificationsApi.remove(n.id);
                          qc.invalidateQueries({ queryKey: ['user-notifications', 1] });
                        }}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserNotifications;


