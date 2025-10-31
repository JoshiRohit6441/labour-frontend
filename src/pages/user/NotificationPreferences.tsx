import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userNotificationsApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';

const UserNotificationPreferences = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<any>({ email: true, sms: false, push: true });

  useEffect(() => {
    userNotificationsApi.getPreferences().then((r) => {
      setPrefs(r.data || {});
    }).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await userNotificationsApi.updatePreferences(prefs);
      toast({ title: 'Preferences saved' });
    } catch (e: any) {
      toast({ title: 'Failed to save', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!prefs.email} onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })} />
                  Email notifications
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!prefs.sms} onChange={(e) => setPrefs({ ...prefs, sms: e.target.checked })} />
                  SMS notifications
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!prefs.push} onChange={(e) => setPrefs({ ...prefs, push: e.target.checked })} />
                  Push notifications
                </label>
                <Button onClick={save}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserNotificationPreferences;


