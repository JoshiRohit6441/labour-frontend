import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contractorNotificationsApi } from '@/lib/api/contractor';

const ContractorNotifications = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['contractor-notifications', 1],
    queryFn: () => contractorNotificationsApi.list(1, 20),
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
                      await contractorNotificationsApi.markAllRead();
                      qc.invalidateQueries({ queryKey: ['contractor-notifications', 1] });
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
                            await contractorNotificationsApi.markAsRead(n.id);
                            qc.invalidateQueries({ queryKey: ['contractor-notifications', 1] });
                          }}>Read</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={async () => {
                          await contractorNotificationsApi.remove(n.id);
                          qc.invalidateQueries({ queryKey: ['contractor-notifications', 1] });
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

export default ContractorNotifications;


